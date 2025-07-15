import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class AutoloadGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    templateDir,
    routesDir = "routes",
    outputFile = "autoload.js",
  }) {
    super({ fileService, templateService, logger });

    this.templatePath = fileService.joinPath(templateDir, "crud/autoload.ejs");
    this.routesDir = routesDir;
    this.outputFile = outputFile;
  }

  async generate(entities, basePath) {
    const rendered = await this.renderTemplate(this.templatePath, { entities });
    const outputPath = await this.ensureDir(basePath, this.routesDir);
    const filePath = await this.writeRenderedFile(
      outputPath,
      this.outputFile,
      rendered
    );

    this.logInfo(`🔄 Archivo de autoload generado: ${filePath}`);
  }
}

export default AutoloadGenerator;
