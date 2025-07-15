class BaseFileGenerator {
  constructor({ fileService, templateService, logger }) {
    this.fileService = fileService;
    this.templateService = templateService;
    this.logger = logger;
  }

  async ensureDir(basePath, subdir) {
    const fullPath = this.fileService.resolvePath(basePath, subdir);
    await this.fileService.ensureDir(fullPath);
    return fullPath;
  }

  async renderTemplate(templatePath, data) {
    return await this.templateService.render(templatePath, data);
  }

  async writeRenderedFile(basePath, relativePath, content) {
    const filePath = this.fileService.resolvePath(basePath, relativePath);
    await this.fileService.writeFile(filePath, content);
    return filePath;
  }

  logInfo(message) {
    if (this.logger) this.logger.info(message);
  }
}

export default BaseFileGenerator;
