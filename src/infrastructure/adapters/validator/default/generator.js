import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";

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
    this.builder = new EntityBuilder({ fileService, logger });
    this.templatePath = fileService.joinPath(templateDir, "validator.ejs");
    this.validatorsDir = validatorsDir;
    this.dbType = dbType;
  }

  async generate(entity, basePath) {
    const definition = await this.builder.buildDefinition(entity);
    const modelName = entity.name;

    try {
      const validatorsPath = await this.ensureDir(basePath, this.validatorsDir);

      const rendered = await this.renderTemplate(this.templatePath, {
        modelName,
        fields: definition.fields,
        dbType: this.dbType,
      });

      const filePath = await this.writeRenderedFile(
        validatorsPath,
        `${modelName}.validator.js`,
        rendered
      );

      this.logInfo(`Validator generated for ${modelName}: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating validator for ${modelName}: ${err.message}`
      );
      throw err;
    }
  }
}

export default ValidatorGenerator;
