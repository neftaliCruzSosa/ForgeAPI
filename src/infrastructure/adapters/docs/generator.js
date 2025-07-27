import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import dbPresets from "../../../config/dbPresets.js";

class DocsGenerator extends BaseFileGenerator {
  constructor(config) {
    super({
      fileService: config.services.fileService,
      templateService: config.services.templateService,
      logger: config.services.logger,
    });

    this.templatePath = config.services.fileService.resolvePath(
      config.templateDir,
      "README.ejs"
    );
    this.dbType = config.dbType;
  }
  async generate({ outputDir, projectName, entities }) {
    try {
      const preset = dbPresets[this.dbType] || {};

      const rendered = await this.renderTemplate(this.templatePath, {
        projectName,
        entities,
        dbType: this.dbType,
        dbLabel: preset.label,
        dbEnvVars:
          typeof preset.env === "function" ? preset.env(projectName) : [],
      });

      const filePath = await this.writeRenderedFile(
        outputDir,
        "README.md",
        rendered
      );
      this.logInfo(`README.md generated at: ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating README.md: ${err.message}`);
      throw err;
    }
  }
}

export default DocsGenerator;
