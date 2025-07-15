import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";

class MongoGenerator extends BaseFileGenerator {
  constructor({ fileService, templateService, logger }) {
    super({ fileService, templateService, logger });
    this.builder = new EntityBuilder();
  }

  async generate(entity, basePath) {
    try {
      const definition = this.builder.buildDefinition(entity);
      const modelsPath = this.fileService.resolvePath(basePath, "models");
      await this.fileService.ensureDir(modelsPath);

      const schemaCode = this.#buildMongooseSchema(definition);
      const filePath = this.fileService.resolvePath(
        modelsPath,
        `${definition.name}.js`
      );
      await this.fileService.writeFile(filePath, schemaCode);

      this.logger.info(`✅ Modelo Mongoose generado: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `❌ Error generating Mongoose model for ${entity.name}: ${err.message}`
      );
      throw err;
    }
  }

  #buildMongooseSchema(definition) {
    const fields = definition.fields
      .map((f) => {
        if (f.type === "ref") {
          const ref = [
            `type: mongoose.Schema.Types.ObjectId`,
            `ref: '${f.ref}'`,
          ];
          if (f.required) ref.push(`required: true`);
          return `  ${f.name}: { ${ref.join(", ")} }`;
        }

        const parts = [`type: ${f.type}`];
        if (f.required) parts.push(`required: true`);
        if (f.minlength) parts.push(`minlength: ${f.minlength}`);
        if (f.maxlength) parts.push(`maxlength: ${f.maxlength}`);
        if (f.unique) parts.push(`unique: true`);
        if (f.default !== undefined)
          parts.push(`default: ${JSON.stringify(f.default)}`);

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

export default MongoGenerator;
