import ejs from "ejs";

class TemplateService {
  constructor(logger = console, fileService) {
    this.logger = logger;
    this.fileService = fileService;
    this.templateDir = this.fileService.resolvePath(
      this.fileService.getCurrentDir(import.meta.url),
      "../../templates"
    );
    this.ctx = {};
  }

  setContext(ctx = {}) {
    this.ctx = ctx;
  }

  async render(templateName, data = {}) {
    try {
      const templatePath = this.fileService.joinPath(
        this.templateDir,
        templateName
      );
      const templateContent = await this.fileService.readFile(
        templatePath,
        "utf-8"
      );
      return ejs.render(templateContent, { ...this.ctx, ...data });
    } catch (err) {
      this.logger.error(
        `Failed to render template "${templateName}": ${err.message}`
      );
      throw err;
    }
  }
}

export default TemplateService;
