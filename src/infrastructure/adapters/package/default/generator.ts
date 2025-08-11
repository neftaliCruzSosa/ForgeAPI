import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, AdapterInstance } from "types";

export default class PackageGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }

  async generate(): Promise<void> {
    try {
      const pkgPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        "package.json"
      );

      const rendered = await this.renderTemplate("package.ejs", {
        projectName: this.ctx.projectName,
        dbType: this.ctx.config.dbType,
        authType: this.ctx.config.authType,
        scripts: {
          dev: "nodemon app.js",
          start: "node app.js",
        },
        dependencies: {
          ...(this.ctx.presets?.framework?.deps ?? {}),
          ...(this.ctx.presets?.db?.deps ?? {}),
          ...(this.ctx.presets?.auth?.deps ?? {}),
        },
        devDependencies: {
          nodemon: "^2.0.22",
        },
      });

      await this.fileService.writeFile(pkgPath, rendered);
      this.logger?.info(`package.json generated: ${pkgPath}`);
    } catch (err) {
      this.logger?.error(`Error generating package.json: ${(err as Error).message}`);
      throw err;
    }
  }
}
