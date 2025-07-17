import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class MiddlewareGenerator extends BaseFileGenerator {
  constructor({
    templateDir,
    fileService,
    templateService,
    logger,
    outputDir = "middlewares",
  }) {
    super({ fileService, templateService, logger });
    this.templateDir = templateDir;
    this.outputDir = outputDir;
  }

  async generate(basePath) {
    try {
      const outputPath = await this.ensureDir(basePath, this.outputDir);

      const templateFiles = (
        await this.fileService.readDir(this.templateDir)
      ).filter((file) => file.endsWith(".ejs"));

      for (const file of templateFiles) {
        const templatePath = this.fileService.resolvePath(
          this.templateDir,
          file
        );
        const rendered = await this.renderTemplate(templatePath);
        const outputName = file.replace(/\.ejs$/, ".js");

        const writtenPath = await this.writeRenderedFile(
          outputPath,
          outputName,
          rendered
        );
        this.logInfo(`🛠️  Middleware generado: ${writtenPath}`);
      }
    } catch (err) {
      this.logger?.error(`Error generating middlewares: ${err.message}`);
      throw err;
    }
  }
}

export default MiddlewareGenerator;
