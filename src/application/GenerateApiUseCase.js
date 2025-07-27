import printSummary from "../utils/printSummary.js";

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
        outputPath,
        services,
      } = config;

      if (!projectName || typeof projectName !== "string") {
        throw new Error("Invalid or missing 'projectName'.");
      }
      if (!Array.isArray(entities) || entities.length === 0) {
        throw new Error("Entity list is empty or invalid.");
      }

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
        structureGenerator,
        crudGenerator,
        autoloadGenerator,
        modelIndexGenerator,
        docsGenerator,
        envExampleGenerator,
        dbConnectionGenerator,
        validatorGenerator,
        middlewareGenerator,
      } = this.generators;

      this.modelsGenerator = modelsGenerator;
      this.dbGenerator = dbGenerator;
      this.authGenerator = authGenerator;
      this.appGenerator = appGenerator;
      this.structureGenerator = structureGenerator;
      this.crudGenerator = crudGenerator;
      this.autoloadGenerator = autoloadGenerator;
      this.modelIndexGenerator = modelIndexGenerator;
      this.docsGenerator = docsGenerator;
      this.envExampleGenerator = envExampleGenerator;
      this.dbConnectionGenerator = dbConnectionGenerator;
      this.validatorGenerator = validatorGenerator;
      this.middlewareGenerator = middlewareGenerator;

      const outputBase = await this.#generateProjectStructure(
        projectName,
        outputPath,
        force
      );
      await this.#generateDocumentation(projectName, entities, outputBase);
      await this.#generateDatabaseConnection(outputBase);
      const models = await this.#generateModels(entities, outputBase);
      if (auth) await this.#generateAuth(outputBase);
      await this.#generateApp(outputBase, auth);
      await this.#generateCRUDs(entities, auth, outputBase);
      await this.#generateIndexing(outputBase);
      await this.#generateEnv(projectName, outputBase);
      await this.#generateValidators(entities, outputBase);
      await this.#generateMiddlewares(outputBase);
      printSummary({
        projectName,
        outputPath: outputBase,
        dbType,
        authType,
        auth,
        models,
        startTime,
      });
      logger.info(`Project successfully generated at: ${outputBase}`);
    } catch (err) {
      logger?.error(`Error during project generation: ${err.message}`);
      throw err;
    }
  }

  async #generateModels(entities, outputBase) {
    this.logger.info("Generating models...");
    try {
      return await this.modelsGenerator?.generate(
        entities,
        outputBase,
        this.dbGenerator
      );
    } catch (err) {
      this.logger.error(`Error generating models: ${err.message}`);
      throw err;
    }
  }

  async #generateAuth(outputBase) {
    this.logger.info("Generating authentication...");
    try {
      await this.authGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`Error generating authentication: ${err.message}`);
      throw err;
    }
  }

  async #generateApp(outputBase, auth) {
    this.logger.info("Generating base app.js...");
    try {
      await this.appGenerator?.generate(outputBase, auth);
    } catch (err) {
      this.logger.error(`Error generating app.js: ${err.message}`);
      throw err;
    }
  }

  async #generateProjectStructure(projectName, projectsRoot, force) {
    try {
      const projectFolder = await this.structureGenerator?.generate(
        projectsRoot,
        projectName,
        force
      );
      return projectFolder;
    } catch (err) {
      this.logger.error(`Error generating project structure: ${err.message}`);
      throw err;
    }
  }

  async #generateDocumentation(projectName, entities, outputBase) {
    try {
      await this.docsGenerator?.generate(outputBase, projectName, entities);
    } catch (err) {
      this.logger.error(`Error generating documentation: ${err.message}`);
      throw err;
    }
  }

  async #generateDatabaseConnection(outputBase) {
    try {
      await this.dbConnectionGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`Error generating database connection: ${err.message}`);
      throw err;
    }
  }

  async #generateCRUDs(entities, auth, outputBase) {
    this.logger.info("Generating CRUDs...");
    try {
      for (const entity of entities) {
        await this.crudGenerator?.generate(entity, auth, outputBase);
      }
      await this.autoloadGenerator?.generate(entities, outputBase);
    } catch (err) {
      this.logger.error(`Error generating CRUDs: ${err.message}`);
      throw err;
    }
  }

  async #generateIndexing(outputBase) {
    try {
      await this.modelIndexGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`Error generating model index: ${err.message}`);
      throw err;
    }
  }

  async #generateEnv(projectName, outputBase) {
    try {
      await this.envExampleGenerator?.generate(outputBase, projectName);
    } catch (err) {
      this.logger.error(`Error generating .env.example: ${err.message}`);
      throw err;
    }
  }

  async #generateValidators(entities, outputBase) {
    try {
      for (const entity of entities) {
        await this.validatorGenerator?.generate(entity, outputBase);
      }
    } catch (err) {
      this.logger.error(`Error generating validators: ${err.message}`);
      throw err;
    }
  }

  async #generateMiddlewares(outputBase) {
    try {
      await this.middlewareGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`Error generating middlewares: ${err.message}`);
      throw err;
    }
  }
}

export default GenerateApiUseCase;
