import type { BaseFileGeneratorDeps, FileService, TemplateService, Logger, AdapterContext, EntityDefinition } from "types";

export default class BaseFileGenerator {
  protected fileService: FileService;
  protected templateService: TemplateService;
  protected logger: Logger;
  protected ctx: AdapterContext & { config: { entities?: EntityDefinition[] } };

  constructor({ fileService, templateService, logger, ctx }: BaseFileGeneratorDeps) {
    this.fileService = fileService;
    this.templateService = templateService;
    this.logger = logger;
    this.ctx = ctx;
  }

  async ensureDir(basePath: string, subdir: string): Promise<string> {
    const fullPath = this.fileService.resolvePath(basePath, subdir);
    try {
      await this.fileService.ensureDir(fullPath);
      return fullPath;
    } catch (err) {
      const e = err as Error;
      this.logger?.error(`Error while ensuring directory "${subdir}": ${e.message}`);
      throw err;
    }
  }

  async renderTemplate(templatePath: string, data: Record<string, unknown> = {}): Promise<string> {
    try {
      return await this.templateService.render(templatePath, {
        ...this.ctx,
        ...data,
      });
    } catch (err) {
      const e = err as Error;
      this.logger?.error(`Error rendering template "${templatePath}": ${e.message}`);
      throw err;
    }
  }

  async writeRenderedFile(basePath: string, relativePath: string, content: string): Promise<string> {
    const filePath = this.fileService.resolvePath(basePath, relativePath);
    try {
      await this.fileService.writeFile(filePath, content);
      return filePath;
    } catch (err) {
      const e = err as Error;
      this.logger?.error(`Error writing rendered file "${relativePath}": ${e.message}`);
      throw err;
    }
  }

  getFolder(name: string, fallback: string = name): string {
    const structure = (this.ctx.presets?.framework as Record<string, any>)?.structure;
    return structure?.[name] || fallback;
  }
}
