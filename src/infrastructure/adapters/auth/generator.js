import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import authControllerPresets from "../../../config/authControllerPresets.js";

class AuthGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    templateDir,
    authType = "jwt",
    dbType = "mongo",
  }) {
    super({ fileService, templateService, logger });

    this.authType = authType;
    this.dbType = dbType;

    this.templateDir = templateDir;
    this.outputDir = "auth";
  }

  async generate(basePath) {
    try {
      const templates = [
        { name: "auth.controller", output: "auth.controller.js" },
        { name: "auth.middleware", output: "auth.middleware.js" },
        { name: "auth.routes", output: "auth.routes.js" },
        { name: `${this.authType}Loader`, output: "index.js" },
      ];

      const outputPath = await this.ensureDir(basePath, this.outputDir);
      const preset = authControllerPresets[this.dbType] || {};

      for (const { name, output } of templates) {
        const templatePath = this.fileService.resolvePath(
          this.templateDir,
          `${name}.ejs`
        );

        const rendered = await this.renderTemplate(templatePath, {
          authType: this.authType,
          preset,
        });

        await this.writeRenderedFile(outputPath, output, rendered);
      }

      this.logInfo(`Auth (${this.authType}) generated at: ${outputPath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating auth module (${this.authType}): ${err.message}`
      );
      throw err;
    }
  }
}

export default AuthGenerator;
