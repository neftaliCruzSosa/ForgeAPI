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
    this.templatePath = this.fileService.joinPath(
      templateDir,
      "connect.ejs"
    );
    this.outputFile = outputFile;
  }

  async generate(basePath) {
    const rendered = await this.renderTemplate(this.templatePath, { dbType: this.dbType });
    const filePath = await this.writeRenderedFile(basePath, this.outputFile, rendered);
    this.logInfo(`📡 Archivo de conexión generado: ${filePath}`);
  }
}

export default DbConnectionGenerator;
