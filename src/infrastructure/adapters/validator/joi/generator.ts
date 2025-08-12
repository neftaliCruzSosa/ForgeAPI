import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";
import type { AdapterContext, AdapterInstance, EntityDefinition } from "types";

export default class ValidatorGenerator
  extends BaseFileGenerator
  implements AdapterInstance
{
  ctx: AdapterContext;
  builder: EntityBuilder;

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
    this.builder = new EntityBuilder();
  }

  async generate(entity: EntityDefinition): Promise<void> {
    try {
      const definition: EntityDefinition = await this.builder.buildDefinition(entity);

      const validatorsPath = await this.ensureDir(
        this.ctx.config.outputDir,
        this.getFolder("validators")
      );

      const { name: modelName, fields } = definition;
      
      const code = await this.renderTemplate("crud/validator.ejs", {
        entity: definition,
        modelName,
        fields,
        dbType: this.ctx.config.dbType,
      });

      const filePath = await this.writeRenderedFile(
        validatorsPath,
        `${modelName}.validator.js`,
        code
      );

      this.logger?.info(`Validator generated for ${modelName}: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating validator for ${entity.name}: ${(err as Error).message}`
      );
      throw err;
    }
  }
}
