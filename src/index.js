import GenerateApiUseCase from "./application/GenerateApiUseCase.js";
import buildGenerators from "./utils/buildGenerators.js";

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

export default async function forgeAPI({
  projectName,
  entities,
  auth = false,
  dbType = "mongo",
  authType = "jwt",
  force = false,
}) {
  const useCase = new GenerateApiUseCase({ buildGenerators });

  try {
    await useCase.generate(projectName, entities, {
      auth,
      dbType,
      authType,
      force,
    });
  } catch (err) {
    console.error(`❌ ForgeAPI falló: ${err.message}`);
    // process.exit(1)
  }
}
