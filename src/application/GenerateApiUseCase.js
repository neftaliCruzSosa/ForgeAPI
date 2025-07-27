import printSummary from "../utils/printSummary.js";
import loadAdapter from "../utils/loadAdapter.js";

class GenerateApiUseCase {
  constructor({ buildGenerators }) {
    this.buildGenerators = buildGenerators;
    this.generators = null;
  }

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

      if (!this.generators) {
        this.generators = await this.buildGenerators(
          dbType,
          authType,
          services
        );
      }

      const {
        dbGenerator,
        modelsGenerator,
        authGenerator,
        appGenerator,
        crudGenerator,
        autoloadGenerator,
        modelIndexGenerator,
        envExampleGenerator,
        dbConnectionGenerator,
        validatorGenerator,
        middlewareGenerator,
      } = this.generators;

      this.modelsGenerator = modelsGenerator;
      this.dbGenerator = dbGenerator;
      this.authGenerator = authGenerator;
      this.appGenerator = appGenerator;
      this.crudGenerator = crudGenerator;
      this.autoloadGenerator = autoloadGenerator;
      this.modelIndexGenerator = modelIndexGenerator;

      this.envExampleGenerator = envExampleGenerator;
      this.dbConnectionGenerator = dbConnectionGenerator;
      this.validatorGenerator = validatorGenerator;
      this.middlewareGenerator = middlewareGenerator;

      
      
      const { generator: projectStructureGenerator } = await loadAdapter("projectStructure", config);      
      const { generator: docsGenerator } = await loadAdapter("docs", config);

      await docsGenerator.generate(config);
      await projectStructureGenerator.generate(config);

      
      
      
      
      await this.#generateDatabaseConnection(outputDir);
      const models = await this.#generateModels(entities, outputDir);
      if (auth) await this.#generateAuth(outputDir);
      await this.#generateApp(outputDir, auth);
      await this.#generateCRUDs(entities, auth, outputDir);
      await this.#generateIndexing(outputDir);
      await this.#generateEnv(projectName, outputDir);
      await this.#generateValidators(entities, outputDir);
      await this.#generateMiddlewares(outputDir);
      printSummary({
        projectName,
        outputDir,
        dbType,
        authType,
        auth,
        models,
        startTime,
      });
      logger.info(`Project successfully generated at: ${outputDir}`);
    } catch (err) {
      logger?.error(`Error during project generation: ${err.message}`);
      throw err;
    }
  }

  async #generateModels(entities, outputDir) {
    this.logger.info("Generating models...");
    try {
      return await this.modelsGenerator?.generate(
        entities,
        outputDir,
        this.dbGenerator
      );
    } catch (err) {
      this.logger.error(`Error generating models: ${err.message}`);
      throw err;
    }
  }

  async #generateAuth(outputDir) {
    this.logger.info("Generating authentication...");
    try {
      await this.authGenerator?.generate(outputDir);
    } catch (err) {
      this.logger.error(`Error generating authentication: ${err.message}`);
      throw err;
    }
  }

  async #generateApp(outputDir, auth) {
    this.logger.info("Generating base app.js...");
    try {
      await this.appGenerator?.generate(outputDir, auth);
    } catch (err) {
      this.logger.error(`Error generating app.js: ${err.message}`);
      throw err;
    }
  }

  async #generateDatabaseConnection(outputDir) {
    try {
      await this.dbConnectionGenerator?.generate(outputDir);
    } catch (err) {
      this.logger.error(`Error generating database connection: ${err.message}`);
      throw err;
    }
  }

  async #generateCRUDs(entities, auth, outputDir) {
    this.logger.info("Generating CRUDs...");
    try {
      for (const entity of entities) {
        await this.crudGenerator?.generate(entity, auth, outputDir);
      }
      await this.autoloadGenerator?.generate(entities, outputDir);
    } catch (err) {
      this.logger.error(`Error generating CRUDs: ${err.message}`);
      throw err;
    }
  }

  async #generateIndexing(outputDir) {
    try {
      await this.modelIndexGenerator?.generate(outputDir);
    } catch (err) {
      this.logger.error(`Error generating model index: ${err.message}`);
      throw err;
    }
  }

  async #generateEnv(projectName, outputDir) {
    try {
      await this.envExampleGenerator?.generate(outputDir, projectName);
    } catch (err) {
      this.logger.error(`Error generating .env.example: ${err.message}`);
      throw err;
    }
  }

  async #generateValidators(entities, outputDir) {
    try {
      for (const entity of entities) {
        await this.validatorGenerator?.generate(entity, outputDir);
      }
    } catch (err) {
      this.logger.error(`Error generating validators: ${err.message}`);
      throw err;
    }
  }

  async #generateMiddlewares(outputDir) {
    try {
      await this.middlewareGenerator?.generate(outputDir);
    } catch (err) {
      this.logger.error(`Error generating middlewares: ${err.message}`);
      throw err;
    }
  }
}

export default GenerateApiUseCase;
