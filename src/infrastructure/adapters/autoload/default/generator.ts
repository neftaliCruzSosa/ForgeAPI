import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class AutoloadGenerator
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
    const autoloadPath = await this.ensureDir(
      this.ctx.config.outputDir,
      this.getFolder("routes")
    );

    const files = await this.fileService.readDir(autoloadPath);
      const routesFiles = files
        .filter((file) => file.endsWith(".js") && file !== "autoload.js")
        .map((file) => file.replace(".routes.js", ""));

    const content = await this.renderTemplate("crud/autoload.ejs", {
      entities: routesFiles || []
    });

    const filePath = await this.writeRenderedFile(
      autoloadPath,
      "autoload.js",
      content
    );

    this.logger?.info(`Autoload file generated: ${filePath}`);
  }
}
