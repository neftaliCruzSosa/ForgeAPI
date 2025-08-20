import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance, EntityDefinition } from "types";

export default class CrudGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;
  dbType: string;
  templateDir: string;
  controllerTemplatePath: string;
  routeTemplatePath: string;

  constructor(ctx: AdapterContext) {
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

  async generate(entity: EntityDefinition): Promise<void> {
    const modelName = entity.name;
    const fields = entity.fields || [];
    const protect = entity.protect || {};
    const validator = this.ctx.config.validator || false;

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
      { modelName, fields, protect, validator }
    );

    const renderedRoute = await this.renderTemplate(
      this.routeTemplatePath,
      { modelName, fields, protect }
    );

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
