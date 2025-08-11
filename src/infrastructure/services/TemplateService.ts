import ejs from "ejs";
import type { Logger, FileService, TemplateService as ITemplateService } from "types";

export default class TemplateService implements ITemplateService {
  readonly logger: Logger;
  readonly fileService: FileService;
  readonly templateDir: string;
  ctx: Record<string, unknown>;

  constructor(logger: Logger, fileService: FileService) {
    this.logger = logger;
    this.fileService = fileService;
    this.templateDir = this.fileService.resolvePath(
      this.fileService.getCurrentDir(import.meta.url),
      "../../templates"
    );
    this.ctx = {};
  }

  setContext(ctx: Record<string, unknown> = {}): void {
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
