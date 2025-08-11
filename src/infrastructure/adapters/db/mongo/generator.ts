import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";
import type { EntityDefinition, AdapterContext, AdapterInstance } from "types";

export default class MongoGenerator
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
      const modelsPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        this.getFolder("models")
      );
      await this.fileService.ensureDir(modelsPath);

      const definition: EntityDefinition = await this.builder.buildDefinition(entity);

      const modelCode = this.buildMongooseSchema(definition);
      const filePath = this.fileService.resolvePath(
        modelsPath,
        `${definition.name}.js`
      );

      await this.fileService.writeFile(filePath, modelCode);

      this.logger?.info(`Mongoose model generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating Mongoose model for ${entity.name}: ${(err as Error).message}`
      );
      throw err;
    }
  }

  private buildMongooseSchema(definition: EntityDefinition): string {
    const fields = definition.fields
      .map((f) => {
        if (f.type === "ref") {
          const refParts = [
            `type: mongoose.Schema.Types.ObjectId`,
            `ref: '${f.ref}'`,
          ];
          if (f.required) refParts.push(`required: true`);
          return `  ${f.name}: { ${refParts.join(", ")} }`;
        }

        const parts: string[] = [`type: ${f.type}`];
        if (f.required) parts.push(`required: true`);
        if (typeof f.minlength === "number") parts.push(`minlength: ${f.minlength}`);
        if (typeof f.maxlength === "number") parts.push(`maxlength: ${f.maxlength}`);
        if (f.unique) parts.push(`unique: true`);
        if (f.default !== undefined) parts.push(`default: ${JSON.stringify(f.default)}`);

        return `  ${f.name}: { ${parts.join(", ")} }`;
      })
      .join(",\n");

    return `import mongoose from 'mongoose';

const ${definition.name}Schema = new mongoose.Schema({
${fields}
}, { timestamps: true });

export default mongoose.model('${definition.name}', ${definition.name}Schema);
`;
  }
}
