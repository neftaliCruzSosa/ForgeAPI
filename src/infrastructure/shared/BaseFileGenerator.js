class BaseFileGenerator {
  constructor({ fileService, templateService, logger }) {
    this.fileService = fileService;
    this.templateService = templateService;
    this.logger = logger;
  }

  async ensureDir(basePath, subdir) {
    const fullPath = this.fileService.resolvePath(basePath, subdir);
    try {
      await this.fileService.ensureDir(fullPath);
      return fullPath;
    } catch (err) {
      this.logger?.error(
        `❌ Error while ensuring directory "${subdir}": ${err.message}`
      );
      throw err;
    }
  }

  async renderTemplate(templatePath, data) {
    try {
      return await this.templateService.render(templatePath, data);
    } catch (err) {
      this.logger?.error(
        `❌ Error rendering template "${templatePath}": ${err.message}`
      );
      throw err;
    }
  }

  async writeRenderedFile(basePath, relativePath, content) {
    const filePath = this.fileService.resolvePath(basePath, relativePath);
    try {
      await this.fileService.writeFile(filePath, content);
      return filePath;
    } catch (err) {
      this.logger?.error(
        `❌ Error writing rendered file "${relativePath}": ${err.message}`
      );
      throw err;
    }
  }

  logInfo(message) {
    if (this.logger) this.logger.info(message);
  }
}

export default BaseFileGenerator;
