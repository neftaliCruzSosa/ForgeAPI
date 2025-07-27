import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import authControllerPresets from "../../../../config/authControllerPresets.js";

export default class ironSessionAuthGenerator extends BaseFileGenerator {
  constructor(config) {
    super({
      fileService: config.services.fileService,
      templateService: config.services.templateService,
      logger: config.services.logger,
    });
  }
  async generate({ outputDir, templateDir, dbType, authType }) {
    try {
      const authPath = this.fileService.resolvePath(outputDir, "auth");
      await this.fileService.ensureDir(authPath);
      const preset = authControllerPresets[dbType] || {};

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
        const templatePath = this.fileService.resolvePath(
          templateDir,
          file.template
        );
        const content = await this.templateService.render(templatePath, {
          authType,
          preset,
        });
        const targetPath = this.fileService.resolvePath(authPath, file.output);
        await this.fileService.writeFile(targetPath, content);
        this.logger.info(`Generated: ${targetPath}`);
      }
    } catch (err) {
      this.logger?.error(`Error generating auth module (ironSession): ${err.message}`);
      throw err;
    }
  }
}
