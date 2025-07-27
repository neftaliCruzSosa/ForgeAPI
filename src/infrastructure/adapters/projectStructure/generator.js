import dbPresets from "../../../config/dbPresets.js";
import authPresets from "../../../config/authPresets.js";
import * as defaultPackage from "../../../config/defaultPackageConfig.js";

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

  async generate(outputPath, projectName, force = false) {
    try {
      this.logger.info(`Generating project ${projectName}`);
      await this.fileService.ensureDir(outputPath);
      this.logger?.info(`Project base folder created at: ${outputPath}`);

      await this.fileService.ensureDir(
        this.fileService.joinPath(outputPath, "models")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(outputPath, "routes")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(outputPath, "controllers")
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
        ...defaultPackage.DEFAULT_DEPENDENCIES,
        ...(dbPreset.deps || {}),
        ...(authPreset.deps || {}),
      };

      const devDeps = {
        ...defaultPackage.DEFAULT_DEV_DEPENDENCIES,
      };

      const scripts = {
        ...defaultPackage.DEFAULT_SCRIPTS,
      };

      const rendered = await this.templateService.render(this.templatePath, {
        projectName,
        dependencies: allDeps,
        devDependencies: devDeps,
        scripts,
        authType: this.authType,
        dbType: this.dbType,
      });

      const filePath = this.fileService.resolvePath(outputPath, "package.json");
      await this.fileService.writeFile(filePath, rendered, "utf-8");

      this.logger?.info(`package.json file generated at: ${filePath}`);
      return outputPath;
    } catch (err) {
      throw err;
    }
  }
}

export default ProjectStructureGenerator;
