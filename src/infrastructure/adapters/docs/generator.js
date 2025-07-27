import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import dbPresets from "../../../config/dbPresets.js";

class DocsGenerator extends BaseFileGenerator {
  constructor({
    templateDir,
    dbType = "mongo",
    fileService,
    templateService,
    logger,
  }) {
    super({ fileService, templateService, logger });
    this.templatePath = fileService.joinPath(templateDir, "README.ejs");
    this.dbType = dbType;
  }

  async generate(basePath, projectName, entities) {
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
        basePath,
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
