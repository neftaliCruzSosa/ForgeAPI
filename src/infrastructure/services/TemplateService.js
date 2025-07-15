import ejs from "ejs";
import fs from "fs/promises";

class TemplateService {
  constructor(logger = console) {
    this.logger = logger;
  }

  async render(templatePath, data = {}) {
    try {
      const templateContent = await fs.readFile(templatePath, "utf-8");
      return ejs.render(templateContent, data);
    } catch (err) {
      this.logger.error(
        `Failed to render template "${templatePath}": ${err.message}`
      );
      throw err;
    }
  }
}

export default TemplateService;
