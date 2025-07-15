import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import EntityBuilder from "../../../domain/services/EntityBuilder.js";

class StaticModelGenerator extends BaseFileGenerator {
  constructor({
    templateDir,
    fileService,
    templateService,
    logger,
    outputDir = "models",
    dbType = "mongo",
  }) {
    super({ fileService, templateService, logger });
    this.templateDir = templateDir;
    this.outputDir = outputDir;
    this.dbType = dbType;
    this.entityBuilder = new EntityBuilder();
  }

  async generate(entity, basePath) {
    const modelPath = await this.ensureDir(basePath, this.outputDir);

    try {
      const definitionPath = this.fileService.resolvePath(
        this.templateDir,
        `${entity.name}.json`
      );
      const exists = await this.fileService.exists(definitionPath);
      if (!exists) {
        this.logger?.warn(
          `❌ No se encontró definición JSON para ${entity.name}`
        );
        return;
      }

      const raw = await this.fileService.readFile(definitionPath);
      const baseDefinition = JSON.parse(raw);

      const fullDefinition = this.entityBuilder.buildDefinition(
        baseDefinition,
        {
          skipSystemFields: entity.skipSystemFields || [],
        }
      );

      const templatePath = this.fileService.resolvePath(
        this.templateDir,
        this.dbType,
        `${entity.name}.ejs`
      );
      const templateExists = await this.fileService.exists(templatePath);
      if (!templateExists) {
        this.logger?.warn(
          `❌ No se encontró plantilla para ${entity.name} en ${this.dbType}`
        );
        return;
      }

      const rendered = await this.renderTemplate(templatePath, fullDefinition);
      const filePath = await this.writeRenderedFile(
        modelPath,
        `${entity.name}.js`,
        rendered
      );

      fullDefinition.protect = entity.protect;
      this.logInfo(`📄 Modelo estático ${entity.name} generado: ${filePath}`);

      return fullDefinition;
    } catch (err) {
      this.logger?.error(
        `❌ Error generating static model for ${entity.name}: ${err.message}`
      );
      throw err;
    }
  }
}

export default StaticModelGenerator;
