import EntityDefinition from "../domain/models/EntityDefinition.js";

class GenerateApiUseCase {
  constructor({ buildGenerators }) {
    this.buildGenerators = buildGenerators;
    this.generators = null;
  }

  async generate(projectName, entities, options = {}) {
    try {
      const { dbType = "mongo", auth = false, authType = "jwt" } = options;

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
          projectName
        );
      }

      const {
        fileService,
        logger,
        dbGenerator,
        modelsGenerator,
        authGenerator,
        appGenerator,
        structuregenerator,
        crudGenerator,
        autoloadGenerator,
        modelIndexGenerator,
        docsGenerator,
        envExampleGenerator,
        dbConnectionGenerator,
        validatorGenerator,
        staticModelGenerator,
        middlewareGenerator,
      } = this.generators;

      this.fileService = fileService;
      this.logger = logger;
      this.modelsGenerator = modelsGenerator;
      this.dbGenerator = dbGenerator;
      this.authGenerator = authGenerator;
      this.appGenerator = appGenerator;
      this.structuregenerator = structuregenerator;
      this.crudGenerator = crudGenerator;
      this.autoloadGenerator = autoloadGenerator;
      this.modelIndexGenerator = modelIndexGenerator;
      this.docsGenerator = docsGenerator;
      this.envExampleGenerator = envExampleGenerator;
      this.dbConnectionGenerator = dbConnectionGenerator;
      this.validatorGenerator = validatorGenerator;
      this.staticModelGenerator = staticModelGenerator;
      this.middlewareGenerator = middlewareGenerator;

      const baseDir = this.fileService.getCurrentDir(import.meta.url);
      const projectRoot = this.fileService.resolvePath(baseDir, "../../");
      const outputBase = this.fileService.resolvePath(
        projectRoot,
        "projects",
        projectName
      );

      await fileService.ensureDir(outputBase);
      logger.info(`📦 Generando proyecto en: ${outputBase}`);

      await this.#generateModels(entities, outputBase);
      if (auth) await this.#generateAuth(outputBase);
      await this.#generateApp(outputBase);
      await this.#generateScaffolding(projectName, outputBase, entities);
      await this.#generateCRUDs(entities, outputBase);
      await this.#generateIndexing(outputBase);
      await this.#generateEnv(outputBase, projectName);
      await this.#generateValidators(entities, outputBase);
      await this.#generateMiddlewares(outputBase);

      logger.info(`✅ Proyecto generado exitosamente en: ${outputBase}`);
    } catch (err) {
      this.generators?.logger?.error(
        "❌ Error durante la generación del proyecto:"
      );
      this.generators?.logger?.error(err.message);
      throw err;
    }
  }

  async #generateModels(entities, outputBase) {
    this.logger.info("📦 Generando modelos...");
    try {
      await this.modelsGenerator?.generate(
        entities,
        outputBase,
        this.staticModelGenerator,
        this.dbGenerator
      );
    } catch (err) {
      this.logger.error(`❌ Error al generar modelos: ${err.message}`);
      throw err;
    }
  }

  async #generateAuth(outputBase) {
    this.logger.info("🔐 Generando autenticación...");
    try {
      await this.authGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`❌ Error al generar autenticación: ${err.message}`);
      throw err;
    }
  }

  async #generateApp(outputBase) {
    this.logger.info("⚙️  Generando app.js base...");
    try {
      await this.appGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`❌ Error al generar app.js: ${err.message}`);
      throw err;
    }
  }

  async #generateScaffolding(projectName, outputBase, entities) {
    try {
      await this.structuregenerator?.generate(outputBase, projectName);
      await this.docsGenerator?.generate(outputBase, projectName, entities);
      await this.dbConnectionGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`❌ Error al generar scaffolding: ${err.message}`);
      throw err;
    }
  }

  async #generateCRUDs(entities, outputBase) {
    this.logger.info("🔁 Generando CRUDs...");
    try {
      for (const entity of entities) {
        await this.crudGenerator?.generate(entity, outputBase);
      }
      await this.autoloadGenerator?.generate(entities, outputBase);
    } catch (err) {
      this.logger.error(`❌ Error al generar CRUDs: ${err.message}`);
      throw err;
    }
  }

  async #generateIndexing(outputBase) {
    try {
      await this.modelIndexGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(
        `❌ Error al generar índice de modelos: ${err.message}`
      );
      throw err;
    }
  }

  async #generateEnv(outputBase, projectName) {
    try {
      await this.envExampleGenerator?.generate(outputBase, projectName);
    } catch (err) {
      this.logger.error(`❌ Error al generar .env.example: ${err.message}`);
      throw err;
    }
  }

  async #generateValidators(entities, outputBase) {
    try {
      for (const entity of entities) {
        await this.validatorGenerator?.generate(entity, outputBase);
      }
    } catch (err) {
      this.logger.error(`❌ Error al generar validadores: ${err.message}`);
      throw err;
    }
  }

  async #generateMiddlewares(outputBase) {
    try {
      await this.middlewareGenerator?.generate(outputBase);
    } catch (err) {
      this.logger.error(`❌ Error al generar middlewares: ${err.message}`);
      throw err;
    }
  }
}

export default GenerateApiUseCase;
