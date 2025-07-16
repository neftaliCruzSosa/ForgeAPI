import BaseFileGenerator from "../../shared/BaseFileGenerator.js";

class ModelIndexGenerator extends BaseFileGenerator {
  constructor({
    fileService,
    templateService,
    logger,
    templateDir,
    outputDir = "models",
    outputFile = "index.js",
  }) {
    super({ fileService, templateService, logger });
    this.outputDir = outputDir;
    this.outputFile = outputFile;
    this.templatePath = fileService.resolvePath(templateDir, `index.ejs`);
  }

  async generate(basePath) {
    try {
      const modelsPath = await this.ensureDir(basePath, this.outputDir);

      const modelFiles = await this.fileService.readDir(modelsPath);
      const models = modelFiles
        .filter((f) => f.endsWith(".js") && f !== "index.js")
        .map((f) => f.replace(".js", ""));

      const rendered = await this.renderTemplate(this.templatePath, { models });

      const filePath = await this.writeRenderedFile(
        modelsPath,
        this.outputFile,
        rendered
      );

      this.logInfo(
        `📦 Archivo models/index.js generado con ${models.length} modelos: ${filePath}`
      );
    } catch (err) {
      this.logger?.error(`Error generating model index: ${err.message}`);
      throw err;
    }
  }
}

export default ModelIndexGenerator;
