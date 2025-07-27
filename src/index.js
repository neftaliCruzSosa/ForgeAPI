import generateAPI from "./application/GenerateApiUseCase.js";
import { validateConfig } from "./application/validators/configValidator.js";
import { loadConfig } from "./application/loadConfig.js";

/**
 * Main entry point for using ForgeAPI programmatically.
 *
 * @param {Object} options
 * @param {string} options.projectName - Name of the project
 * @param {Array} options.entities - Entity definitions
 * @param {boolean} [options.auth=true] - Enable auth system
 * @param {string} [options.dbType="mongo"] - Database type (e.g. "mongo", "postgres", more supported in the future)
 * @param {string} [options.authType="jwt"] - Auth strategy (e.g. "jwt", "ironSession", more supported in the future)
 * @param {string} [options.framework="express"] - Framework to generate the API with (e.g. "express", more supported in the future)
 */

export default async function forgeAPI(options = {}) {
  try {
    const config = await loadConfig(options);
    await validateConfig(config);
    await generateAPI(config);
  } catch (err) {
    console.error(`❌ ForgeAPI failed: ${err.message}`);
  }
}
