import dbPresets from "../../../../config/dbPresets.js";
import authPresets from "../../../../config/authPresets.js";
import * as defaultPackage from "../../../../config/defaultPackageConfig.js";

class ProjectStructureGenerator {
  constructor(config) {
    this.templatePath = config.services.fileService.resolvePath(
      config.templateDir,
      "package.ejs"
    );
    this.fileService = config.services.fileService;
    this.templateService = config.services.templateService;
    this.logger = config.services.logger;
    this.dbType = config.dbType;
    this.authType = config.authType;
  }

  async generate({ outputDir, projectName }) {
    try {
      this.logger.info(`Generating project ${projectName}`);
      await this.fileService.ensureDir(outputDir);
      this.logger?.info(`Project base folder created at: ${outputDir}`);

      await this.fileService.ensureDir(
        this.fileService.joinPath(outputDir, "models")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(outputDir, "routes")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(outputDir, "controllers")
      );

      const dbPreset = dbPresets[this.dbType] || {};
      const authPreset = authPresets[this.authType] || {};

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

      const filePath = this.fileService.resolvePath(outputDir, "package.json");
      await this.fileService.writeFile(filePath, rendered, "utf-8");

      this.logger?.info(`package.json file generated at: ${filePath}`);
    } catch (err) {
      throw err;
    }
  }
}

export default ProjectStructureGenerator;
