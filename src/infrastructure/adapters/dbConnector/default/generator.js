import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

export default class DbConnectionGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
    this.dbType = ctx.config.dbType;
    this.templatePath = `db/${this.dbType}/connect.ejs`;
    this.outputFile = "db.js";
  }

  async generate() {
    try {
      const rendered = await this.renderTemplate(this.templatePath, {
        dbType: this.dbType,
      });
      const filePath = await this.writeRenderedFile(
        this.ctx.config.outputDir,
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
