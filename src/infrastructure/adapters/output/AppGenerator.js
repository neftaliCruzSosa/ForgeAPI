import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class AppGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    templateDir,
    outputFile = "app.js",
  }) {
    super({ fileService, templateService, logger });
    this.outputFile = outputFile;
    this.templatePath = fileService.resolvePath(templateDir, "app.ejs");
  }

  async generate(basePath) {
    try {
      const rendered = await this.renderTemplate(this.templatePath, {});
      const filePath = await this.writeRenderedFile(
        basePath,
        this.outputFile,
        rendered
      );
      this.logInfo(`✅ Archivo ${this.outputFile} generado en ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating ${this.outputFile}: ${err.message}`
      );
      throw err;
    }
  }
}

export default AppGenerator;
