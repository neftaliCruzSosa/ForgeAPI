import printSummary from "../utils/printSummary.js";
import loadAdapter from "../utils/loadAdapter.js";

export default async function generateAPI(config = {}) {
  const { fileService, templateService, logger } = config.services;
  const startTime = Date.now();
  try {
    const ctx = {
      config,
      presets: {},
    };

    templateService.setContext?.(ctx);

    await fileService.ensureDir(config.outputDir);

    const { generator: frameworkGenerator } = await loadAdapter(
      "framework",
      config.framework,
      ctx
    );
    const { generator: dbGenerator } = await loadAdapter(
      "db",
      config.dbType,
      ctx
    );
    const { generator: authGenerator } = await loadAdapter(
      "auth",
      config.authType,
      ctx
    );
    const { generator: crudGenerator } = await loadAdapter(
      "crud",
      "default",
      ctx
    );
    const { generator: docsGenerator } = await loadAdapter(
      "docs",
      "default",
      ctx
    );
    const { generator: autoloadGenerator } = await loadAdapter(
      "autoload",
      "default",
      ctx
    );
    const { generator: validatorGenerator } = await loadAdapter(
      "validator",
      "default",
      ctx
    );
    const { generator: envGenerator } = await loadAdapter(
      "env",
      "default",
      ctx
    );
    const { generator: modelIndexGenerator } = await loadAdapter(
      "modelIndex",
      "default",
      ctx
    );
    const { generator: middlewareGenerator } = await loadAdapter(
      "middleware",
      "default",
      ctx
    );
    const { generator: dbConnectorGenerator } = await loadAdapter(
      "dbConnector",
      "default",
      ctx
    );
    const { generator: packageGenerator } = await loadAdapter(
      "package",
      "default",
      ctx
    );

    await frameworkGenerator.generate();
    await authGenerator.generate();
    await docsGenerator.generate();
    await envGenerator.generate();
    await autoloadGenerator.generate();
    await middlewareGenerator.generate();
    await dbConnectorGenerator.generate();
    await packageGenerator.generate();
    const generatedModels = [];
    for (const entity of config.entities) {
      await validatorGenerator.generate(entity);
      await crudGenerator.generate(entity);
      await dbGenerator.generate(entity);
      generatedModels.push(entity);
    }
    await modelIndexGenerator.generate();

    printSummary(ctx, generatedModels, startTime);
    logger?.info(`Project successfully generated at: ${config.outputDir}`);
  } catch (err) {
    logger?.error(`Error during project generation: ${err.message}`);
    throw err;
  }
}
