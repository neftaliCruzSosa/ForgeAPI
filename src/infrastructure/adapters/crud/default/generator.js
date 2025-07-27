import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

export default class CrudGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;

    this.dbType = ctx?.config?.dbType || "mongo";
    this.templateDir = ctx?.templateDir || "crud";

    const defaultControllerPath = this.fileService.joinPath(
      this.templateDir,
      this.dbType,
      "controller.ejs"
    );

    const defaultRoutePath = this.fileService.joinPath(
      this.templateDir,
      "routes.ejs"
    );

    this.controllerTemplatePath = defaultControllerPath;
    this.routeTemplatePath = defaultRoutePath;
  }

  async generate(entity) {
    const modelName = entity.name;
    const fields = entity.overrideFields || entity.fields || [];
    const protect = entity.protect || {};

    const controllersPath = await this.ensureDir(
      this.ctx.config.outputDir,
      this.getFolder("controllers")
    );
    const routesPath = await this.ensureDir(
      this.ctx.config.outputDir,
      this.getFolder("routes")
    );

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

    this.logger?.info(`CRUD generated for ${modelName}`);
    this.logger?.info(`  ├─ Controller: ${controllerFile}`);
    this.logger?.info(`  └─ Routes:     ${routeFile}`);
  }
}
