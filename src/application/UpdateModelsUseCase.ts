import loadAdapter from "../utils/loadAdapter.js";
import { protectRowsToRules } from "../infrastructure/persistence/mappers.js";
import {
  findProjectByName,
  syncEntities,
} from "../infrastructure/persistence/projectRepository.js";
import EntityBuilder from "../domain/services/EntityBuilder.js";
import path from "node:path";

import type {
  AdapterContext,
  AdapterConfig,
  EntityDefinition,
  UpdateModelsOptions,
  PrismaEntityRow,
} from "types";

function validateRefs(finalEntities: EntityDefinition[]) {
  const names = new Set(finalEntities.map((e) => e.name));
  const errors: string[] = [];

  for (const e of finalEntities) {
    for (const f of e.fields ?? []) {
      if (String(f.type).toLowerCase() === "ref") {
        if (!f.ref || !names.has(f.ref)) {
          errors.push(
            `Entity "${e.name}" → field "${f.name}" has unknown ref "${f.ref ?? "(empty)"}"`
          );
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`Refs validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function defsFromPrismaEntities(rows: PrismaEntityRow[]): EntityDefinition[] {
  return rows
    .filter((e) => !!e.name)
    .map((e) => ({
      name: e.name,
      fields: e.fields.map((f) => ({
        name: f.name,
        type: String(f.type).toLowerCase(),
        ref: f.ref ?? undefined,
        required: !!f.required,
      })),
      protect: protectRowsToRules(e.protect) ?? undefined,
    }));
}

async function removeFiles(
  entityName: string,
  ctx: AdapterContext
): Promise<void> {
  const { fileService, logger } = ctx.config.services;
  const out = ctx.config.outputDir;

  const structure = (ctx.presets as any)?.framework?.structure ?? {
    models: "models",
    controllers: "controllers",
    routes: "routes",
    validators: "validators",
  };

  const targets = [
    path.join(out, structure.models, `${entityName}.js`),
    path.join(out, structure.controllers, `${entityName}.controller.js`),
    path.join(out, structure.routes, `${entityName}.routes.js`),
    path.join(out, structure.validators, `${entityName}.validator.js`),
  ];

  for (const t of targets) {
    try {
      if (await fileService.pathExists(t)) {
        await fileService.remove(t);
        logger?.info?.(`removed: ${t}`);
      }
    } catch (e: any) {
      logger?.warn?.(`could not remove "${t}": ${e?.message ?? String(e)}`);
    }
  }
}

export default async function updateModelsUseCase({
  projectName,
  changes,
  services,
}: UpdateModelsOptions): Promise<void> {
  const logger = services?.logger;

  const startTime = Date.now();
  logger?.info?.(`Starting models update for project "${projectName}"...`);

  try {
    const project = await findProjectByName(projectName);
    if (!project) {
      throw new Error(`Project '${projectName}' not found.`);
    }

    const currentEntities = defsFromPrismaEntities(project.entities as any);

    const mapByName = new Map(currentEntities.map((e) => [e.name, e]));
    const toAdd: EntityDefinition[] = [];
    const toUpdate: EntityDefinition[] = [];
    const toRemove: string[] = [];

    for (const change of changes) {
      const { option, entity } = change;

      if (!entity?.name || !entity.name.trim()) {
        throw new Error(`Invalid change: entity name is required.`);
      }

      if (option === "delete") {
        if (mapByName.has(entity.name)) mapByName.delete(entity.name);
        toRemove.push(entity.name);
        continue;
      }

      const normalized: EntityDefinition = {
        name: entity.name,
        fields: (entity.fields ?? []).map((f) => ({
          name: f.name,
          type: String(f.type).toLowerCase(),
          ref: f.ref ?? undefined,
          required: !!f.required,
        })),
        protect: entity.protect,
      };

      if (option === "create") {
        if (mapByName.has(normalized.name)) {
          throw new Error(
            `Entity "${normalized.name}" already exists. Use 'update' to replace it.`
          );
        }
        mapByName.set(normalized.name, normalized);
        toAdd.push(normalized);
      } else if (option === "update") {
        if (!mapByName.has(normalized.name)) {
          throw new Error(
            `Entity "${normalized.name}" does not exist for update.`
          );
        }
        mapByName.set(normalized.name, normalized);
        toUpdate.push(normalized);
      } else {
        throw new Error(`Unknown option: ${option}`);
      }
    }

    const finalEntities = Array.from(mapByName.values());

    validateRefs(finalEntities);

    const builder = new EntityBuilder();
    for (const ent of finalEntities) {
      await builder.buildDefinition(ent);
    }

    const cfgForAdapters: AdapterConfig = {
      services,
      outputDir: project.outputDir,
      projectName,
      dbType: project.dbType,
      authType: project.authType,
      framework: project.framework,
      auth: !!project.auth,
      entities: finalEntities,
    };
    const ctx: AdapterContext = { config: cfgForAdapters, presets: {} };

    await loadAdapter("framework", project.framework, ctx);

    const dbAdapterName = project.dbType;
    const db = await loadAdapter("db", dbAdapterName, ctx);
    const crud = await loadAdapter("crud", "default", ctx);
    const validator = await loadAdapter("validator", "default", ctx);

    for (const entity of finalEntities) {
      await validator.generator.generate(entity);
      await crud.generator.generate(entity);
      await db.generator.generate(entity);
      logger?.info?.(`Generated new files for entity: ${entity.name}`);
    }

    for (const name of toRemove) {
      await removeFiles(name, ctx);
    }

    const { generator: modelIndex } = await loadAdapter(
      "modelIndex",
      "default",
      ctx
    );
    await modelIndex.generate();
    logger?.info?.(`Models index regenerated.`);

    try {
      const { generator: autoload } = await loadAdapter(
        "autoload",
        "default",
        ctx
      );
      await autoload.generate();
      logger?.info?.(`Autoload regenerated.`);
    } catch (e: any) {
      logger?.warn?.(
        `Could not regenerate autoload: ${e?.message ?? String(e)}`
      );
    }

    try {
      await syncEntities(project.id, {
        add: toAdd,
        update: toUpdate,
        remove: toRemove,
      });
      logger?.info?.(`Project metadata updated in SQLite via Prisma.`);
    } catch (e: any) {
      logger?.warn?.(
        `Could not persist project metadata: ${e?.message ?? String(e)}`
      );
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    logger?.info?.(
      `Models update completed for "${projectName}" (created: ${toAdd.length}, updated: ${toUpdate.length}, deleted: ${toRemove.length}) in ${duration}s.`
    );
  } catch (err: any) {
    logger?.error?.(
      `❌ Error during models update for "${projectName}": ${err?.message ?? String(err)}`
    );
    throw err;
  }
}
