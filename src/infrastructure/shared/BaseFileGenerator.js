export default class BaseFileGenerator {
  constructor({ fileService, templateService, logger, ctx = {} }) {
    this.fileService = fileService;
    this.templateService = templateService;
    this.logger = logger;
    this.ctx = ctx;
  }

  async ensureDir(basePath, subdir) {
    const fullPath = this.fileService.resolvePath(basePath, subdir);
    try {
      await this.fileService.ensureDir(fullPath);
      return fullPath;
    } catch (err) {
      this.logger?.error(
        `Error while ensuring directory "${subdir}": ${err.message}`
      );
      throw err;
    }
  }

  async renderTemplate(templatePath, data) {
    try {
      return await this.templateService.render(templatePath, {
        ...this.ctx,
        ...data,
      });
    } catch (err) {
      this.logger?.error(
        `Error rendering template "${templatePath}": ${err.message}`
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
        `Error writing rendered file "${relativePath}": ${err.message}`
      );
      throw err;
    }
  }

  getFolder(name, fallback = name) {
    return this.ctx.presets.framework.structure?.[name] || fallback;
  }
}
