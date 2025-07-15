import EntityDefinition from "../domain/models/EntityDefinition.js";

class GenerateApiUseCase {
  constructor({ buildGenerators }) {
    this.buildGenerators = buildGenerators;
    this.generators = null;
  }

  async generate(projectName, entities, options = {}) {
    const { dbType = "mongo", auth = false, authType = "jwt" } = options;

    if (!this.generators) {
      this.generators = await this.buildGenerators(dbType, authType);
    }

    const {
      fileService,
      logger,
      dbGenerator,
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

    logger.info(`✅ Proyecto generado en: ${outputBase}`);
  }

  async #generateModels(entities, outputBase) {
    this.logger.info("📦 Generando modelos...");

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (entity.builtIn) {
        const fullEntity = await this.staticModelGenerator?.generate(
          entity,
          outputBase
        );
        if (fullEntity) {
          entities[i] = fullEntity;
        }
      } else {
        const def = new EntityDefinition(entity.name, entity.fields);
        await this.dbGenerator?.generate(def, outputBase);
      }
    }
  }

  async #generateAuth(outputBase) {
    this.logger.info("🔐 Generando autenticación...");
    await this.authGenerator?.generate(outputBase);
  }

  async #generateApp(outputBase) {
    this.logger.info("⚙️  Generando app.js base...");
    await this.appGenerator?.generate(outputBase);
  }

  async #generateScaffolding(projectName, outputBase, entities) {
    await this.structuregenerator?.generate(outputBase, projectName);
    await this.docsGenerator?.generate(outputBase, projectName, entities);
    await this.dbConnectionGenerator?.generate(outputBase);
  }

  async #generateCRUDs(entities, outputBase) {
    this.logger.info("🔁 Generando CRUDs...");
    for (const entity of entities) {
      await this.crudGenerator?.generate(entity, outputBase);
    }

    await this.autoloadGenerator?.generate(entities, outputBase);
  }

  async #generateIndexing(outputBase) {
    await this.modelIndexGenerator?.generate(outputBase);
  }

  async #generateEnv(outputBase, projectName) {
    await this.envExampleGenerator?.generate(outputBase, projectName);
  }

  async #generateValidators(entities, outputBase) {
    for (const entity of entities) {
      await this.validatorGenerator?.generate(entity, outputBase);
    }
  }

  async #generateMiddlewares(outputBase) {
    await this.middlewareGenerator?.generate(outputBase);
  }
}

export default GenerateApiUseCase;
