import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class DbConnectionGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;
  dbType: string;
  templatePath: string;
  outputFile: string;

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
    this.dbType = ctx.config.dbType ?? "mongo";
    this.templatePath = `db/${this.dbType}/connect.ejs`;
    this.outputFile = "db.js";
  }

  async generate(): Promise<void> {
    try {
      const rendered = await this.renderTemplate(this.templatePath, {
        dbType: this.dbType,
      });
      const filePath = await this.writeRenderedFile(
        this.ctx.config.outputDir,
        this.outputFile,
        rendered
      );
      this.logger?.info(`DB connection file generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating DB connection file: ${(err as Error).message}`);
      throw err;
    }
  }
}
