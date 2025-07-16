import dbPresets from "../../../config/dbPresets.js";
import authPresets from "../../../config/authPresets.js";

class ProjectStructureGenerator {
  constructor({
    templateDir,
    fileService,
    templateService,
    logger,
    dbType,
    authType,
  }) {
    this.templatePath = fileService.joinPath(templateDir, "package.ejs");
    this.fileService = fileService;
    this.templateService = templateService;
    this.logger = logger;
    this.dbType = dbType;
    this.authType = authType;
  }

  async generate(basePath, projectName, force = false) {
    const outputPath = this.fileService.resolvePath(basePath, projectName);
    try {
      if (await this.fileService.pathExists(outputPath)) {
        if (!force) {
          throw new Error(
            `Proyecto '${projectName}' ya existe. Usa 'force: true' para sobrescribir.`
          );
        }
        await this.fileService.remove(outputPath);
      }
      this.logger.info(`📦 Generando proyecto en: ${outputPath}`);
      await this.fileService.ensureDir(outputPath);
      this.logger?.info(
        `📁 Carpeta base del proyecto creada en: ${outputPath}`
      );

      await this.fileService.ensureDir(
        this.fileService.joinPath(outputPath, "models")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(outputPath, "routes")
      );

      const dbPreset = dbPresets[this.dbType] || {};
      const authPreset = authPresets[this.authType] || {};
      const baseDeps = {
        express: "^4.18.2",
        dotenv: "^16.3.1",
        helmet: "^7.0.0",
        cors: "^2.8.5",
        morgan: "^1.10.0",
        joi: "^17.9.2",
      };

      const allDeps = {
        ...baseDeps,
        ...(dbPreset.deps || {}),
        ...(authPreset.deps || {}),
      };

      const devDeps = {
        nodemon: "^3.0.3",
      };

      const rendered = await this.templateService.render(this.templatePath, {
        projectName,
        dependencies: allDeps,
        devDependencies: devDeps,
        authType: this.authType,
        dbType: this.dbType,
      });

      const filePath = this.fileService.resolvePath(outputPath, "package.json");
      await this.fileService.writeFile(filePath, rendered, "utf-8");

      this.logger?.info(`📦 Archivo package.json generado en: ${filePath}`);
      return outputPath;
    } catch (err) {
      throw err;
    }
  }
}

export default ProjectStructureGenerator;
