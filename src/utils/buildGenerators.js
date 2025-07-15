import * as Services from "../infrastructure/services/index.js";
import * as OutputGenerators from "../infrastructure/adapters/output/index.js";

import { SUPPORTED_DATABASES, SUPPORTED_AUTHS } from "../config/constants.js";

async function buildGenerators(
  dbType = "mongo",
  authType = "jwt",
  projectName
) {
  const logger = new Services.LoggerService({projectName});
  const fileService = new Services.FileSystemService(logger);
  const templateService = new Services.TemplateService(logger);

  const services = { fileService, templateService, logger };

  if (!SUPPORTED_DATABASES.includes(dbType)) {
    logger.error(
      `❌ Unsupported database type: "${dbType}". Supported: ${SUPPORTED_DATABASES.join(
        ", "
      )}`
    );
    throw new Error(`Unsupported database type: ${dbType}`);
  }

  if (!SUPPORTED_AUTHS.includes(authType)) {
    logger.error(
      `❌ Unsupported auth type: "${authType}". Supported: ${SUPPORTED_AUTHS.join(
        ", "
      )}`
    );
    throw new Error(`Unsupported auth type: ${authType}`);
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  let DbGenerator;

  try {
    const dbGeneratorModule = await import(
      `../infrastructure/adapters/db/${dbType}/${capitalize(
        dbType
      )}Generator.js`
    );
    DbGenerator = dbGeneratorModule.default;
  } catch (err) {
    logger.error(
      `❌ Failed to load DB generator for "${dbType}": ${err.message}`
    );
    throw new Error(`Cannot find generator for dbType "${dbType}"`);
  }

  const baseDir = fileService.getCurrentDir(import.meta.url);
  const templatesRootPath = fileService.joinPath(baseDir, "../templates");

  return {
    ...services,
    appGenerator: new OutputGenerators.AppGenerator({
      ...services,
      templateDir: templatesRootPath,
    }),
    dbGenerator: new DbGenerator(services),
    dbConnectionGenerator: new OutputGenerators.DbConnectionGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "db", dbType),
      dbType,
    }),
    crudGenerator: new OutputGenerators.CrudGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    validatorGenerator: new OutputGenerators.ValidatorGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    structuregenerator: new OutputGenerators.ProjectStructureGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
      authType,
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
      templateDir: fileService.joinPath(templatesRootPath, "models", dbType),
    }),
    middlewareGenerator: new OutputGenerators.MiddlewareGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "middlewares"),
    }),
    staticModelGenerator: new OutputGenerators.StaticModelGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "models"),
      dbType,
    }),
    docsGenerator: new OutputGenerators.DocsGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
    }),
    authGenerator: new OutputGenerators.AuthGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "auth", authType),
      authType,
      dbType,
    }),
  };
}

export default buildGenerators;
