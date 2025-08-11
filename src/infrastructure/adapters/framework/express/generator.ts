import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type {
  AdapterContext,
  AdapterInstance,
} from "types";

export default class AppGenerator
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
      const appCode = await this.renderTemplate(
        "app.ejs",
        this.ctx.config as unknown as Record<string, unknown>
      );

      const appPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        "app.js"
      );

      await this.fileService.writeFile(appPath, appCode);

      this.logger?.info(`Framework base generated: ${appPath}`);
    } catch (err) {
      this.logger?.error(`Error generating app.js: ${(err as Error).message}`);
      throw err;
    }
  }
}
