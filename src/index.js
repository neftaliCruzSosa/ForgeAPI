import GenerateApiUseCase from "./application/GenerateApiUseCase.js";
import buildGenerators from "./utils/buildGenerators.js";
import { buildDefaultServices } from "./application/factories/buildDefaultServices.js";
import { validateConfig } from "./application/validators/configValidator.js";

/**
 * Main entry point for using ForgeAPI programmatically.
 *
 * @param {Object} options
 * @param {string} options.projectName - Name of the project
 * @param {Array} options.entities - Entity definitions
 * @param {boolean} [options.auth=true] - Enable auth system
 * @param {string} [options.dbType="mongo"] - Database type (e.g. "mongo", "postgres", more supported in the future)
 * @param {string} [options.authType="jwt"] - Auth strategy (e.g. "jwt", "ironSession", more supported in the future)
 */

export default async function forgeAPI(options = {}) {
  try {
    const {
      projectName,
      entities,
      dbType = "mongo",
      authType = "jwt",
      auth = false,
      framework = "express",
      force = false,
      author = "unknown",
      services = buildDefaultServices(projectName),
      outputDir = `./projects/${projectName}`,
      templateDir = `./src/templates`,
    } = options;

    const useCase = new GenerateApiUseCase({ buildGenerators });

    const config = {
      projectName,
      entities,
      dbType,
      authType,
      auth,
      framework,
      force,
      author,
      services,
      outputDir,
      templateDir,
    };

    await validateConfig(config);

    await useCase.generate(config);
  } catch (err) {
    console.error(`❌ ForgeAPI failed: ${err.message}`);
    // process.exit(1)
  }
}
