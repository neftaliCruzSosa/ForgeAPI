import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class ModelIndexGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }

  async generate(): Promise<void> {
    try {
      const modelsPath = await this.ensureDir(
        this.ctx.config.outputDir,
        this.getFolder("models")
      );

      const dbType = this.ctx.config.dbType;

      const files = await this.fileService.readDir(modelsPath);
      const modelFiles = files
        .filter((file) => file.endsWith(".js") && file !== "index.js")
        .map((file) => file.replace(".js", ""));

      const code = await this.renderTemplate(
        `models/${dbType}/index.ejs`,
        { models: modelFiles }
      );

      const indexPath = await this.writeRenderedFile(
        modelsPath,
        "index.js",
        code
      );

      this.logger?.info(
        `models/index.js file generated with ${modelFiles.length} models: ${indexPath}`
      );
    } catch (err) {
      this.logger?.error(`Error generating model index: ${(err as Error).message}`);
      throw err;
    }
  }
}
