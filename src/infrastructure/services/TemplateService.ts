import ejs from "ejs";
import type { Logger, FileService, TemplateService as ITemplateService, AdapterContext } from "types";

export default class TemplateService implements ITemplateService {
  readonly logger: Logger;
  readonly fileService: FileService;
  readonly templateDir: string;
  ctx: AdapterContext;

  constructor(logger: Logger, fileService: FileService) {
    this.logger = logger;
    this.fileService = fileService;
    this.templateDir = this.fileService.resolvePath(
      this.fileService.getCurrentDir(import.meta.url),
      "../../templates"
    );
    this.ctx = { config: { services: { logger, fileService, templateService: this }, outputDir: "", projectName: "" } };
  }

  setContext(ctx: AdapterContext): void {
    this.ctx = ctx;
  }

  async render(templateName: string, data: Record<string, unknown> = {}): Promise<string> {
    try {
      const templatePath = this.fileService.joinPath(this.templateDir, templateName);
      const templateContent = await this.fileService.readFile(templatePath);
      return ejs.render(templateContent, { ...this.ctx, ...data });
    } catch (err) {
      this.logger?.error(
        `Failed to render template "${templateName}": ${(err as Error).message}`
      );
      throw err;
    }
  }
}
