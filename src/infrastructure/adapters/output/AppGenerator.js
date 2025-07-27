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

  async generate(basePath, auth) {
    try {
      const rendered = await this.renderTemplate(this.templatePath, { auth });
      const filePath = await this.writeRenderedFile(
        basePath,
        this.outputFile,
        rendered
      );
      this.logInfo(`File ${this.outputFile} generated at ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating ${this.outputFile}: ${err.message}`);
      throw err;
    }
  }
}

export default AppGenerator;
