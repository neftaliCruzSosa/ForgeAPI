import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import envPresets from "../../../config/envPresets.js";

class EnvExampleGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    dbType = "mongo",
    authType = "jwt",
  }) {
    super({ fileService, templateService, logger });
    this.dbType = dbType;
    this.authType = authType;
  }

  async generate(basePath, projectName = "my-api") {
    const filePath = this.fileService.resolvePath(basePath, ".env.example");

    const common = envPresets.common || [];
    const authVars = envPresets.auth[this.authType] || [];
    const dbVars =
      typeof envPresets.db[this.dbType] === "function"
        ? envPresets.db[this.dbType](projectName)
        : [];

    const content = [...common, ...authVars, ...dbVars].join("\n") + "\n";

    await this.writeRenderedFile(basePath, ".env.example", content);
    this.logInfo(`⚙️  .env.example generado en: ${filePath}`);
  }
}

export default EnvExampleGenerator;
