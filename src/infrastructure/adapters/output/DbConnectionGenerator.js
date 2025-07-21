import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class DbConnectionGenerator extends BaseFileGenerator {
  constructor({
    dbType = "mongo",
    fileService,
    templateService,
    logger,
    templateDir,
    outputFile = "db.js",
  }) {
    super({ fileService, templateService, logger });

    this.dbType = dbType;
    this.templatePath = this.fileService.joinPath(templateDir, "connect.ejs");
    this.outputFile = outputFile;
  }

  async generate(basePath) {
    try {
      const rendered = await this.renderTemplate(this.templatePath, {
        dbType: this.dbType,
      });
      const filePath = await this.writeRenderedFile(
        basePath,
        this.outputFile,
        rendered
      );
      this.logInfo(`DB connection file generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating DB connection file: ${err.message}`);
      throw err;
    }
  }
}

export default DbConnectionGenerator;
