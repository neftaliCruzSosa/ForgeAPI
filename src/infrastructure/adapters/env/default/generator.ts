import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";
import type { AdapterContext, EnvVar } from "types";

export default class EnvExampleGenerator extends BaseFileGenerator {
  ctx: AdapterContext;

  constructor(ctx: AdapterContext) {
    super({
      fileService: ctx.config.services.fileService,
      templateService: ctx.config.services.templateService,
      logger: ctx.config.services.logger,
      ctx,
    });
    this.ctx = ctx;
  }

  async generate(): Promise<void> {
    try {
      const getEnvArray = (env?: EnvVar[] | ((projectName: string) => EnvVar[])): EnvVar[] =>
        typeof env === "function"
          ? env(this.ctx.config.projectName)
          : env || [];

      const allVars: EnvVar[] = [
        ...getEnvArray(this.ctx.presets?.db?.env),
        ...getEnvArray(this.ctx.presets?.auth?.env),
        ...getEnvArray(this.ctx.presets?.framework?.env),
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
      this.logger?.error(`Error generating .env.example: ${(err as Error).message}`);
      throw err;
    }
  }
}
