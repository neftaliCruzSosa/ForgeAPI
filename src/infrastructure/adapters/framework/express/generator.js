import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class AppGenerator extends BaseFileGenerator {
  constructor(config) {
    super({
      fileService: config.services.fileService,
      templateService: config.services.templateService,
      logger: config.services.logger,
    });
    this.outputFile = "app.js";
    this.templatePath = this.fileService.resolvePath(
      config.templateDir,
      "app.ejs"
    );
  }

  async generate({ outputDir, auth }) {
    try {
      const rendered = await this.renderTemplate(this.templatePath, { auth });
      const filePath = await this.writeRenderedFile(
        outputDir,
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
