import printSummary from "../utils/printSummary.js";
import loadAdapter from "../utils/loadAdapter.js";
import { saveOrUpdateProject } from "../infrastructure/persistence/projectRepository.js";

import type {
  GenerateApiConfig,
  AdapterContext,
  EntityDefinition,
} from "types";

export default async function generateAPI(config: GenerateApiConfig): Promise<void> {
  const { fileService, templateService, logger } = config.services;
  const startTime = Date.now();

  try {
    const ctx: AdapterContext = {
      config,
      presets: {},
    };

    templateService.setContext?.(ctx);

    const outputDirPath = config.outputDir;

    await fileService.ensureDir(outputDirPath);

    const noOp = { generate: async (_: any) => {} };

    const { generator: frameworkGenerator }   = await loadAdapter("framework",   config.framework,  ctx);
    const { generator: dbGenerator }          = await loadAdapter("db",          config.dbType,     ctx);
    const { generator: authGenerator }        = await loadAdapter("auth",        config.authType,   ctx);
    // const { generator: validatorGenerator }   = await loadAdapter("validator",   config.validator,  ctx);
    const { generator: crudGenerator }        = await loadAdapter("crud",        "default",         ctx);
    const { generator: docsGenerator }        = await loadAdapter("docs",        "default",         ctx);
    const { generator: autoloadGenerator }    = await loadAdapter("autoload",    "default",         ctx);
    const { generator: envGenerator }         = await loadAdapter("env",         "default",         ctx);
    const { generator: modelIndexGenerator }  = await loadAdapter("modelIndex",  "default",         ctx);
    const { generator: middlewareGenerator }  = await loadAdapter("middleware",  "default",         ctx);
    const { generator: dbConnectorGenerator } = await loadAdapter("dbConnector", "default",         ctx);
    const { generator: packageGenerator }     = await loadAdapter("package",     "default",         ctx);

    const { generator: validatorGenerator = noOp } = config.validator
  ? await loadAdapter("validator", config.validator, ctx)
  : { generator: noOp };

    await frameworkGenerator.generate();
    if (config.auth) await authGenerator.generate();
    await docsGenerator.generate();
    await envGenerator.generate();
    await middlewareGenerator.generate();
    await dbConnectorGenerator.generate();
    await packageGenerator.generate();

    const generatedModels: EntityDefinition[] = [];
    for (const entity of config.entities) {
      await validatorGenerator.generate(entity);
      await crudGenerator.generate(entity);
      await dbGenerator.generate(entity);
      generatedModels.push(entity);
    }

    await autoloadGenerator.generate();
    await modelIndexGenerator.generate();

    try {
      await saveOrUpdateProject({ config, models: generatedModels });
      logger?.info?.(`Project metadata saved to SQLite via Prisma.`);
    } catch (err: any) {
      logger?.warn?.(`Could not persist project metadata: ${err.message}`);
    }

    printSummary(ctx, generatedModels, startTime);
    logger?.info?.(`Project successfully generated at: ${outputDirPath}`);
  } catch (err: any) {
    logger?.error?.(`Error during project generation: ${err.message}`);
    throw err;
  }
}
