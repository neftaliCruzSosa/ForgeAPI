import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class MiddlewareGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;

    const preset = this.ctx.presets.framework;
    this.templateDir = preset.middlewareTemplateDir || "middlewares";
    this.middlewareFiles = preset.middlewares || [];
  }

  async generate() {
    try {
      const middlewaresPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        this.getFolder("middlewares")
      );
      await this.fileService.ensureDir(middlewaresPath);

      for (const file of this.middlewareFiles) {
        const templatePath = `${this.templateDir}/${file}`;
        const rendered = await this.renderTemplate(templatePath);
        const outputName = file.replace(/\.ejs$/, ".js");
        const writtenPath = await this.writeRenderedFile(
          middlewaresPath,
          outputName,
          rendered
        );

        this.logger?.info(`Middleware generated: ${writtenPath}`);
      }
    } catch (err) {
      this.logger?.error(`Error generating middlewares: ${err.message}`);
      throw err;
    }
  }
}

export default MiddlewareGenerator;
