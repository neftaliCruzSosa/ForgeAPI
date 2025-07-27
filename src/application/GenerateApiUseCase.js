import printSummary from "../utils/printSummary.js";
import loadAdapter from "../utils/loadAdapter.js";

class GenerateApiUseCase {
  constructor() {}

  async generate(config = {}) {
    const { logger } = config.services;
    this.logger = logger;
    const startTime = Date.now();
    try {
      const {
        projectName,
        entities,
        dbType,
        auth,
        authType,
        force,
        outputDir,
        templateDir,
        services,
      } = config;
      
      const { generator: projectStructureGenerator } = await loadAdapter("projectStructure","default", config);      
      const { generator: docsGenerator } = await loadAdapter("docs","default", config);
      const { generator: appGenerator } = await loadAdapter("framework", "express", config);
      const { generator: authGenerator } = await loadAdapter("auth", authType, config);

      await projectStructureGenerator.generate(config);
      await docsGenerator.generate(config);
      await appGenerator.generate(config);
      await authGenerator.generate(config);
      
      
      
      
      
      // printSummary({
      //   projectName,
      //   outputDir,
      //   dbType,
      //   authType,
      //   auth,
      //   models,
      //   startTime,
      // });
      logger.info(`Project successfully generated at: ${outputDir}`);
    } catch (err) {
      logger?.error(`Error during project generation: ${err.message}`);
      throw err;
    }
  }
}

export default GenerateApiUseCase;
