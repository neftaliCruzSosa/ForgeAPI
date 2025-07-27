import ejs from "ejs";
import fs from "fs/promises";

class TemplateService {
  constructor(logger = console, fileService) {
    this.logger = logger;
    this.fileService = fileService;
    this.templateDir = this.fileService.resolvePath(
      this.fileService.getCurrentDir(import.meta.url),
      "../../templates"
    );
    this.context = {};
  }

  setContext(context = {}) {
    this.context = context;
  }

  async render(templateName, data = {}) {
    console.log(this.templateDir);
    try {
      const templatePath = this.fileService.joinPath(
        this.templateDir,
        templateName
      );
      const templateContent = await fs.readFile(templatePath, "utf-8");
      return ejs.render(templateContent, data);
    } catch (err) {
      this.logger.error(
        `Failed to render template "${templateName}": ${err.message}`
      );
      throw err;
    }
  }
}

export default TemplateService;
