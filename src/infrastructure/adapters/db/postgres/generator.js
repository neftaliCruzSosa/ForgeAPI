import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";

class PostgresGenerator extends BaseFileGenerator {
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
      const modelsPath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        this.getFolder("models")
      );
      await this.fileService.ensureDir(modelsPath);

      const definition = await this.builder.buildDefinition(entity);
      const modelCode = this.#buildSequelizeModel(definition);
      const filePath = this.fileService.resolvePath(
        modelsPath,
        `${definition.name}.js`
      );
      await this.fileService.writeFile(filePath, modelCode);

      this.logger?.info(`Sequelize model generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating Sequelize model for ${entity.name}: ${err.message}`
      );
      throw err;
    }
  }

  #buildSequelizeModel(def) {
    const fieldLines = [];
    const relations = [];

    const resolveType = (field) => {
      if (field.type === "ref") {
        relations.push(
          `  models.${def.name}.belongsTo(models.${field.ref}, { foreignKey: '${field.name}' });`
        );
        return "INTEGER";
      }
      if (field.type.toLowerCase() === "array")
        return "ARRAY(DataTypes.STRING)";
      return field.type.toUpperCase();
    };

    def.fields.forEach((field) => {
      const parts = [];

      parts.push(`type: DataTypes.${resolveType(field)}`);

      if (field.required) parts.push("allowNull: false");
      if (field.unique) parts.push("unique: true");
      if (field.default !== undefined)
        parts.push(`defaultValue: ${JSON.stringify(field.default)}`);

      fieldLines.push(`        ${field.name}: { ${parts.join(", ")} }`);
    });

    const relationBlock =
      relations.length > 0
        ? `static associate(models) {\n  ${relations.join("\n")}\n  }`
        : `static associate(models) {}`;

    return `import { Model, DataTypes } from 'sequelize';

class ${def.name} extends Model {
  static initModel(sequelize) {
    ${def.name}.init(
      {
${fieldLines.join(",\n")}
      },
      {
        sequelize,
        modelName: '${def.name}',
        timestamps: true
      }
    );
  }
  
  ${relationBlock}
}

export default ${def.name};`;
  }
}

export default PostgresGenerator;
