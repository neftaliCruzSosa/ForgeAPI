import * as Services from "../infrastructure/services/index.js";
import * as OutputGenerators from "../infrastructure/adapters/output/index.js";

import { SUPPORTED_DATABASES, SUPPORTED_AUTHS } from "../config/constants.js";

async function buildGenerators(dbType = "mongo", authType = "jwt", services) {
  if (!SUPPORTED_DATABASES.includes(dbType)) {
    services.logger.error(
      `Unsupported database type: "${dbType}". Supported: ${SUPPORTED_DATABASES.join(
        ", "
      )}`
    );
    throw new Error(`Unsupported database type: ${dbType}`);
  }

  if (!SUPPORTED_AUTHS.includes(authType)) {
    services.logger.error(
      `Unsupported auth type: "${authType}". Supported: ${SUPPORTED_AUTHS.join(
        ", "
      )}`
    );
    throw new Error(`Unsupported auth type: ${authType}`);
  }

  let DbGenerator;

  try {
    const dbGeneratorModule = await import(
      `../infrastructure/adapters/db/${dbType}/generator.js`
    );
    DbGenerator = dbGeneratorModule.default;
  } catch (err) {
    services.logger.error(
      `Failed to load DB generator for "${dbType}": ${err.message}`
    );
    throw new Error(`Cannot find generator for dbType "${dbType}"`);
  }

  const baseDir = services.fileService.getCurrentDir(import.meta.url);
  const templatesRootPath = services.fileService.joinPath(
    baseDir,
    "../templates"
  );
  return {
    structureGenerator: new OutputGenerators.ProjectStructureGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
      authType,
    }),
    modelsGenerator: new OutputGenerators.ModelsGenerator({ ...services }),
    appGenerator: new OutputGenerators.AppGenerator({
      ...services,
      templateDir: templatesRootPath,
    }),
    dbGenerator: new DbGenerator(services),
    dbConnectionGenerator: new OutputGenerators.DbConnectionGenerator({
      ...services,
      templateDir: services.fileService.joinPath(
        templatesRootPath,
        "db",
        dbType
      ),
      dbType,
    }),
    crudGenerator: new OutputGenerators.CrudGenerator({
      ...services,
      templateDir: services.fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    validatorGenerator: new OutputGenerators.ValidatorGenerator({
      ...services,
      templateDir: services.fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    autoloadGenerator: new OutputGenerators.AutoloadGenerator({
      ...services,
      templateDir: templatesRootPath,
    }),
    envExampleGenerator: new OutputGenerators.EnvExampleGenerator({
      ...services,
      dbType,
      authType,
    }),
    modelIndexGenerator: new OutputGenerators.ModelIndexGenerator({
      ...services,
      templateDir: services.fileService.joinPath(
        templatesRootPath,
        "models",
        dbType
      ),
    }),
    middlewareGenerator: new OutputGenerators.MiddlewareGenerator({
      ...services,
      templateDir: services.fileService.joinPath(
        templatesRootPath,
        "middlewares"
      ),
    }),
    docsGenerator: new OutputGenerators.DocsGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
    }),
    authGenerator: new OutputGenerators.AuthGenerator({
      ...services,
      templateDir: services.fileService.joinPath(
        templatesRootPath,
        "auth",
        authType
      ),
      authType,
      dbType,
    }),
  };
}

export default buildGenerators;
