import prisma from "./prisma/client.js";
import EntityBuilder from "../../domain/services/EntityBuilder.js";
import type { AdapterConfig, EntityDefinition } from "types";
import {
  fieldsToRows,
  rulesToProtectRows,
} from "./mappers.js";

interface SaveOrUpdateProjectParams {
  config: AdapterConfig;
  models: EntityDefinition[];
}

export async function findProjectByName(name: string) {
  return prisma.proyect.findUnique({
    where: { name },
    include: { entities: { include: { fields: true, protect: true } } },
  });
}

export async function syncEntities(
  proyectId: number,
  delta: { add?: EntityDefinition[]; update?: EntityDefinition[]; remove?: string[] }
) {
  if (delta.remove?.length) {
    await prisma.entity.deleteMany({ where: { proyectId, name: { in: delta.remove } } });
  }

  for (const ent of delta.update ?? []) {
    const existing = await prisma.entity.findFirst({
      where: { proyectId, name: ent.name },
      include: { fields: true, protect: true },
    });
    if (!existing) continue;

    await prisma.field.deleteMany({ where: { entityId: existing.id } });
    await prisma.protect.deleteMany({ where: { entityId: existing.id } });

    await prisma.entity.update({
      where: { id: existing.id },
      data: {
        fields: { create: fieldsToRows(ent.fields) },
        protect:{ create: rulesToProtectRows(ent.protect) },
      },
    });
  }

  for (const ent of delta.add ?? []) {
    await prisma.entity.create({
      data: {
        proyectId,
        name: ent.name,
        fields: { create: fieldsToRows(ent.fields) },
        protect:{ create: rulesToProtectRows(ent.protect) },
      },
    });
  }
}

export async function saveOrUpdateProject({ config, models }: SaveOrUpdateProjectParams) {
  const builder = new EntityBuilder();

  const byName = new Map<string, EntityDefinition>((models || []).map((m) => [m.name, m]));
  const resolved: EntityDefinition[] = [];
  for (const m of models || []) {
    const def = await builder.buildDefinition(m);
    const original = byName.get(def.name) ?? ({} as EntityDefinition);
    resolved.push({ name: def.name, fields: def.fields || [], protect: original.protect });
  }

  const entitiesData = resolved.map((m) => ({
    name: m.name,
    fields: { create: fieldsToRows(m.fields) },
    protect: { create: rulesToProtectRows(m.protect) },
  }));

  const data = {
    name: config.projectName,
    outputDir: config.outputDir,
    dbType: config.dbType!,
    authType: config.authType!,
    framework: config.framework!,
    author: config.author ?? null,
    auth: !!config.auth,
    entities: { create: entitiesData },
  };

  const existing = await prisma.proyect.findUnique({ where: { name: data.name }, select: { id: true } });

  if (!existing) return prisma.proyect.create({ data });

  await prisma.entity.deleteMany({ where: { proyectId: existing.id } });

  return prisma.proyect.update({
    where: { id: existing.id },
    data: {
      outputDir: data.outputDir,
      dbType: data.dbType,
      authType: data.authType,
      framework: data.framework,
      author: data.author,
      auth: data.auth,
      entities: { create: entitiesData },
    },
  });
}
