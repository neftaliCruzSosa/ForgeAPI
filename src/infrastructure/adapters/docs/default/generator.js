import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class DocsGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }
  async generate() {
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
      this.logger?.error(`Error generating README.md: ${err.message}`);
      throw err;
    }
  }
}

export default DocsGenerator;
