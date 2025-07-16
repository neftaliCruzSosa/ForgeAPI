import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class ValidatorGenerator extends BaseFileGenerator {
  constructor({
    templateDir,
    fileService,
    templateService,
    logger,
    dbType = "mongo",
    validatorsDir = "validators",
  }) {
    super({ fileService, templateService, logger });
    this.templatePath = fileService.joinPath(templateDir, "validator.ejs");
    this.validatorsDir = validatorsDir;
    this.dbType = dbType;
  }

  async generate(entity, basePath) {
    const modelName = entity.name;
    const fields = entity.overrideFields || entity.fields || [];

    try {
      const validatorsPath = await this.ensureDir(basePath, this.validatorsDir);

      const rendered = await this.renderTemplate(this.templatePath, {
        modelName,
        fields,
        dbType: this.dbType,
      });

      const filePath = await this.writeRenderedFile(
        validatorsPath,
        `${modelName}.validator.js`,
        rendered
      );

      this.logInfo(`🧪 Validator generado para ${modelName}: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating validator for ${modelName}: ${err.message}`
      );
      throw err;
    }
  }
}

export default ValidatorGenerator;
