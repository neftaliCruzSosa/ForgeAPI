import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class DocsGenerator
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
      const readme = await this.renderTemplate("README.ejs");
      const readmeFile = await this.writeRenderedFile(
        this.ctx.config.outputDir,
        "README.md",
        readme
      );

      this.logger?.info("Documentation generated:");
      this.logger?.info(`  └─ ${readmeFile}`);
    } catch (err) {
      this.logger?.error(`Error generating README.md: ${(err as Error).message}`);
      throw err;
    }
  }
}
