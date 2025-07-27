import dbPresets from "../../../../config/dbPresets.js";
import authPresets from "../../../../config/authPresets.js";
import * as defaultPackage from "../../../../config/defaultPackageConfig.js";
import BaseFileGenerator from "../../../shared/BaseFileGenerator.js";

class ProjectStructureGenerator extends BaseFileGenerator {
  constructor(config) {
    super({
      fileService: config.services.fileService,
      templateService: config.services.templateService,
      logger: config.services.logger,
    });
  }

  async generate(config) {
    try {
      this.logger.info(`Generating project ${config.projectName}`);
      this.logger?.info(`Project base folder created at: ${config.outputDir}`);

      await this.fileService.ensureDir(
        this.fileService.joinPath(config.outputDir, "models")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(config.outputDir, "routes")
      );
      await this.fileService.ensureDir(
        this.fileService.joinPath(config.outputDir, "controllers")
      );

      const dbPreset = dbPresets[config.dbType] || {};
      const authPreset = authPresets[config.authType] || {};

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

      const rendered = await this.templateService.render("package.ejs", {
        projectName: config.projectName,
        dependencies: allDeps,
        devDependencies: devDeps,
        scripts,
        authType: config.authType,
        dbType: config.dbType,
      });

      const filePath = this.fileService.resolvePath(
        config.outputDir,
        "package.json"
      );
      await this.fileService.writeFile(filePath, rendered, "utf-8");

      this.logger?.info(`package.json file generated at: ${filePath}`);
    } catch (err) {
      throw err;
    }
  }
}

export default ProjectStructureGenerator;
