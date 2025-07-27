import printSummary from "../utils/printSummary.js";
import loadAdapter from "../utils/loadAdapter.js";

class GenerateApiUseCase {
  async generate(config = {}) {
    const { fileService, templateService, logger } = config.services;
    const startTime = Date.now();
    try {
      const context = {
        config,
        presets: {},
      };

      templateService.setContext?.(context);

      await fileService.ensureDir(config.outputDir);
      const { generator: projectStructureGenerator } = await loadAdapter(
        "projectStructure",
        "default",
        config
      );
      // const { generator: docsGenerator } = await loadAdapter(
      //   "docs",
      //   "default",
      //   config
      // );
      // const { generator: appGenerator } = await loadAdapter(
      //   "framework",
      //   "express",
      //   config
      // );
      // const { generator: authGenerator } = await loadAdapter(
      //   "auth",
      //   config.authType,
      //   config
      // );

      await projectStructureGenerator.generate(config);
      // await docsGenerator.generate(config);
      // await appGenerator.generate(config);
      // await authGenerator.generate(config);

      // printSummary({
      //   projectName,
      //   outputDir,
      //   dbType,
      //   authType,
      //   auth,
      //   models,
      //   startTime,
      // });
      logger.info(`Project successfully generated at: ${config.outputDir}`);
    } catch (err) {
      logger?.error(`Error during project generation: ${err.message}`);
      throw err;
    }
  }
}

export default GenerateApiUseCase;
