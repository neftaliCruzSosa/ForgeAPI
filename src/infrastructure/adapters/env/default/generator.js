import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class EnvExampleGenerator extends BaseFileGenerator {
  constructor(ctx) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }

  async generate() {
    try {
      const allVars = [
        ...(this.ctx.presets.db.env(this.ctx.config.projectName) || []),
        ...(this.ctx.presets.auth.env || []),
        ...(this.ctx.presets.framework.env || []),
      ];
      const lines = allVars.map(({ key, value, comment }) => {
        const commentLine = comment ? `# ${comment}` : "";
        return [commentLine, `${key}=${value}`].filter(Boolean).join("\n");
      });
      const content = lines.join("\n") + "\n";

      const filePath = this.fileService.resolvePath(
        this.ctx.config.outputDir,
        ".env.example"
      );

      await this.fileService.writeFile(filePath, content);
      this.logger?.info(`.env.example generated at: ${filePath}`);
    } catch (err) {
      this.logger?.error(`Error generating .env.example: ${err.message}`);
      throw err;
    }
  }
}

export default EnvExampleGenerator;
