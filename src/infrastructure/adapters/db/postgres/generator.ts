import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../../domain/services/EntityBuilder.js";
import type { EntityDefinition, BuiltField, AdapterContext, AdapterInstance } from "types";

export default class PostgresGenerator
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
      const modelCode = this.buildSequelizeModel(definition);
      const filePath = this.fileService.resolvePath(
        modelsPath,
        `${definition.name}.js`
      );
      await this.fileService.writeFile(filePath, modelCode);

      this.logger?.info(`Sequelize model generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(
        `Error generating Sequelize model for ${entity.name}: ${(err as Error).message}`
      );
      throw err;
    }
  }

  private buildSequelizeModel(def: EntityDefinition): string {
    const fieldLines: string[] = [];
    const relations: string[] = [];

    const resolveType = (field: BuiltField): string => {
      
      if (field.type === "ref") {
        relations.push(
          `  models.${def.name}.belongsTo(models.${field.ref}, { foreignKey: '${field.name}' });`
        );
        return "INTEGER";
      }
      if (field.type.toLowerCase() === "array") {
        return "ARRAY(DataTypes.STRING)";
      }
      return field.type.toUpperCase();
    };

    def.fields.forEach((field) => {
      const parts: string[] = [];

      parts.push(`type: DataTypes.${resolveType(field)}`);

      if (field.required) parts.push("allowNull: false");
      if (field.unique) parts.push("unique: true");
      if (field.default !== undefined) {
        parts.push(`defaultValue: ${JSON.stringify(field.default)}`);
      }

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
