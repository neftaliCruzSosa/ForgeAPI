import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class AppGenerator extends BaseFileGenerator {
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
      const appCode = await this.renderTemplate("app.ejs", this.ctx.config);

      const appPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        "app.js"
      );

      await this.fileService.writeFile(appPath, appCode);

      this.logger?.info(`Framework base generated: ${appPath}`);
    } catch (err) {
      this.logger?.error(`Error generating ${this.outputFile}: ${err.message}`);
      throw err;
    }
  }
}

export default AppGenerator;
