import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";

class PostgresGenerator extends BaseFileGenerator {
  constructor({ fileService, templateService, logger}) {
    super({ fileService, templateService, logger });
    this.builder = new EntityBuilder();
  }

  async generate(entity, basePath) {
    const definition = this.builder.buildDefinition(entity);
    const modelsPath = this.fileService.resolvePath(basePath, "models");
    await this.fileService.ensureDir(modelsPath);

    const code = this.#buildSequelizeModel(definition);
    const filePath = this.fileService.resolvePath(
      modelsPath,
      `${definition.name}.js`
    );
    await this.fileService.writeFile(filePath, code);

    this.logger.info(`✅ Modelo Sequelize generado: ${filePath}`);
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
