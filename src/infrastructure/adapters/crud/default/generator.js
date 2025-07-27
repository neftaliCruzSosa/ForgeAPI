import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class CrudGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    templateDir,
    dbType = "mongo",
    controllerTemplatePath,
    routeTemplatePath,
    controllersDir = "controllers",
    routesDir = "routes",
  }) {
    super({ fileService, templateService, logger });

    this.dbType = dbType;
    this.templateDir = templateDir;
    this.controllersDir = controllersDir;
    this.routesDir = routesDir;

    const defaultControllerPath =
      templateDir &&
      fileService.joinPath(templateDir, dbType, "controller.ejs");
    const defaultRoutePath =
      templateDir && fileService.joinPath(templateDir, "routes.ejs");

    this.controllerTemplatePath =
      controllerTemplatePath || defaultControllerPath;
    this.routeTemplatePath = routeTemplatePath || defaultRoutePath;
  }

  async generate(entity, auth, basePath) {
    const modelName = entity.name;
    const fields = entity.overrideFields || entity.fields || [];
    const protect = entity.protect || {};

    const controllersPath = await this.ensureDir(basePath, this.controllersDir);
    const routesPath = await this.ensureDir(basePath, this.routesDir);

    const renderedController = await this.renderTemplate(
      this.controllerTemplatePath,
      {
        modelName,
        fields,
        protect,
      }
    );

    const renderedRoute = await this.renderTemplate(this.routeTemplatePath, {
      modelName,
      fields,
      protect,
      auth,
    });

    const controllerFile = await this.writeRenderedFile(
      controllersPath,
      `${modelName}.controller.js`,
      renderedController
    );
    const routeFile = await this.writeRenderedFile(
      routesPath,
      `${modelName}.routes.js`,
      renderedRoute
    );

    this.logInfo(`CRUD generated for ${modelName}`);
    this.logInfo(`  ├─ Controller: ${controllerFile}`);
    this.logInfo(`  └─ Routes:     ${routeFile}`);
  }
}

export default CrudGenerator;
