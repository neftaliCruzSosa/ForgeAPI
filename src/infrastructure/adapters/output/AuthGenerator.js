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

  async generate(projectPath) {
    const templates = [
      { name: "auth.controller", output: "auth.controller.js" },
      { name: "auth.middleware", output: "auth.middleware.js" },
      { name: "auth.routes", output: "auth.routes.js" },
      { name: `${this.authType}Loader`, output: "index.js" },
    ];

    const outputPath = await this.ensureDir(projectPath, this.outputDir);
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

    this.logInfo(`✅ Auth (${this.authType}) generado en: ${outputPath}`);
  }
}

export default AuthGenerator;
