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
    try {
      const rendered = await this.renderTemplate(this.templatePath, {
        entities,
      });
      const outputPath = await this.ensureDir(basePath, this.routesDir);
      const filePath = await this.writeRenderedFile(
        outputPath,
        this.outputFile,
        rendered
      );

      this.logInfo(`Autoload file generated: ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating autoload file: ${err.message}`);
      throw err;
    }
  }
}

export default AutoloadGenerator;
