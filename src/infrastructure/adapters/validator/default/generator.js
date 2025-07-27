import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";

class ValidatorGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
    this.builder = new EntityBuilder({
      fileService: this.fileService,
      logger: this.logger,
    });
  }

  async generate(entity) {
    try {
      const definition = await this.builder.buildDefinition(entity);
      const validatorsPath = await this.ensureDir(
        this.ctx.config.outputDir,
        this.getFolder("validators")
      );

      const modelName = definition.name;
      const fields = definition.fields;
      const code = await this.renderTemplate("crud/validator.ejs", {
        entity: definition,
        modelName,
        fields,
        dbType: this.ctx.dbLabel,
      });

      const filePath = await this.writeRenderedFile(
        validatorsPath,
        `${definition.name}.validator.js`,
        code
      );

      this.logInfo(`Validator generated for ${modelName}: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating validator for ${entity.name}: ${err.message}`
      );
      throw err;
    }
  }
}

export default ValidatorGenerator;
