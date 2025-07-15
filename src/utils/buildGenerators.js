import FileSystemService from "../infrastructure/services/FileSystemService.js";
import TemplateService from "../infrastructure/services/TemplateService.js";
import LoggerService from "../infrastructure/services/LoggerService.js";

import AppGenerator from "../infrastructure/adapters/output/AppGenerator.js";
import DbConnectionGenerator from "../infrastructure/adapters/output/DbConnectionGenerator.js";
import CrudGenerator from "../infrastructure/adapters/output/CrudGenerator.js";
import ValidatorGenerator from "../infrastructure/adapters/output/ValidatorGenerator.js";
import ProjectStructureGenerator from "../infrastructure/adapters/output/ProjectStructureGenerator.js";
import AutoloadGenerator from "../infrastructure/adapters/output/AutoloadGenerator.js";
import EnvExampleGenerator from "../infrastructure/adapters/output/EnvExampleGenerator.js";
import ModelIndexGenerator from "../infrastructure/adapters/output/ModelIndexGenerator.js";
import MiddlewareGenerator from "../infrastructure/adapters/output/MiddlewareGenerator.js";
import StaticModelGenerator from "../infrastructure/adapters/output/StaticModelGenerator.js";
import DocsGenerator from "../infrastructure/adapters/output/DocsGenerator.js";
import AuthGenerator from "../infrastructure/adapters/output/AuthGenerator.js";

async function buildGenerators(dbType = "mongo", authType = "jwt") {
  const fileService = new FileSystemService();
  const templateService = new TemplateService();
  const logger = new LoggerService();

  const services = { fileService, templateService, logger };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const dbGeneratorModule = await import(
    `../infrastructure/adapters/db/${dbType}/${capitalize(dbType)}Generator.js`
  );
  const DbGenerator = dbGeneratorModule.default;
  const baseDir = fileService.getCurrentDir(import.meta.url);
  const templatesRootPath = fileService.joinPath(baseDir, "../templates");

  return {
    ...services,
    appGenerator: new AppGenerator({
      ...services,
      templateDir: templatesRootPath,
    }),
    dbGenerator: new DbGenerator(services),
    dbConnectionGenerator: new DbConnectionGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "db", dbType),
      dbType,
    }),
    crudGenerator: new CrudGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    validatorGenerator: new ValidatorGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "crud"),
      dbType,
    }),
    structuregenerator: new ProjectStructureGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
      authType,
    }),
    autoloadGenerator: new AutoloadGenerator({
      ...services,
      templateDir: templatesRootPath,
    }),
    envExampleGenerator: new EnvExampleGenerator({
      ...services,
      dbType,
      authType,
    }),
    modelIndexGenerator: new ModelIndexGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, `models`, dbType),
    }),
    middlewareGenerator: new MiddlewareGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "middlewares"),
    }),
    staticModelGenerator: new StaticModelGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, "models"),
      dbType,
    }),
    docsGenerator: new DocsGenerator({
      ...services,
      templateDir: templatesRootPath,
      dbType,
    }),
    authGenerator: new AuthGenerator({
      ...services,
      templateDir: fileService.joinPath(templatesRootPath, `auth`, authType),
      authType,
      dbType,
    }),
  };
}

export default buildGenerators;
