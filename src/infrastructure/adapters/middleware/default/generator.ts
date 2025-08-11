import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class MiddlewareGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;
  templateDir: string;
  middlewareFiles: string[];

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });

    this.ctx = ctx;

    const preset = this.ctx.presets?.framework ?? {};
    this.templateDir = (preset.middlewareTemplateDir as string) || "middlewares";
    this.middlewareFiles = (preset.middlewares as string[]) || [];
  }

  async generate(): Promise<void> {
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
      this.logger?.error(`Error generating middlewares: ${(err as Error).message}`);
      throw err;
    }
  }
}
