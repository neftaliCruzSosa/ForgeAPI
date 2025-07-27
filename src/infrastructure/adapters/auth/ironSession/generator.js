import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

export default class ironSessionAuthGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }
  async generate() {
    try {
      const authPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        this.getFolder("auth")
      );
      await this.fileService.ensureDir(authPath);

      const files = [
        {
          template: "auth/ironSession/auth.controller.ejs",
          output: "auth.controller.js",
        },
        {
          template: "auth/ironSession/auth.middleware.ejs",
          output: "auth.middleware.js",
        },
        {
          template: "auth/ironSession/auth.routes.ejs",
          output: "auth.routes.js",
        },
        {
          template: "auth/ironSession/ironSessionLoader.ejs",
          output: "index.js",
        },
      ];

      for (const file of files) {
        const content = await this.templateService.render(file.template);
        const targetPath = this.fileService.resolvePath(authPath, file.output);
        await this.fileService.writeFile(targetPath, content);
        this.logger.info(`Generated: ${targetPath}`);
      }
    } catch (err) {
      this.logger?.error(
        `Error generating auth module (ironSession): ${err.message}`
      );
      throw err;
    }
  }
}
