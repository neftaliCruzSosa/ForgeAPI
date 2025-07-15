import ejs from 'ejs';
import fs from 'fs/promises';

class TemplateService {
  async render(templatePath, data = {}) {
    const templateContent = await fs.readFile(templatePath, "utf-8");
    return ejs.render(templateContent, data);
  }
}

export default TemplateService;
