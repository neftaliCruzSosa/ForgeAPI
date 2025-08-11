import generateAPI from "./application/GenerateApiUseCase.js";
import updateModelsUseCase from "./application/UpdateModelsUseCase.js";

import { validateConfig } from "./application/validators/configValidator.js";
import { loadConfig } from "./application/loadConfig.js";

import type {
  LoadConfigOptions,
  GenerateApiConfig,
  EntityDefinition,
  ValidateConfigOptions,
  UpdateModelsOptions,
} from "types";

/**
 * Main entry point for using ForgeAPI programmatically.
 *
 * @example
 * await forgeAPI({
 *   projectName: "my-api",
 *   entities: [...],
 *   dbType: "mongo",
 *   authType: "jwt",
 *   framework: "express",
 *   auth: true
 * });
 */
export default async function forgeAPI(
  options: LoadConfigOptions & { entities: EntityDefinition[] }
): Promise<void> {
  try {
    const cfg = await loadConfig(options);

    const fullConfig: GenerateApiConfig = {
      ...cfg,
      entities: options.entities,
    };

    const toValidate: ValidateConfigOptions = {
      projectName: fullConfig.projectName,
      entities: fullConfig.entities,
      dbType: fullConfig.dbType,
      authType: fullConfig.authType,
      framework: fullConfig.framework,
      services: { fileService: fullConfig.services.fileService },
      outputDir: fullConfig.outputDir,
      force: fullConfig.force,
    };

    await validateConfig(toValidate);

    await generateAPI(fullConfig);
  } catch (err: any) {
    console.log(err);
    console.error(`❌ ForgeAPI failed: ${err.message}`);
    throw err;
  }
}

export async function updateModels(options: UpdateModelsOptions): Promise<void> {
  const { projectName } = options;

  const cfg = await loadConfig({ projectName });

  await updateModelsUseCase({
    projectName,
    changes: options.changes,
    services: cfg.services,
  });
}

export { default as generateAPI } from "./application/GenerateApiUseCase.js";
export { default as updateModelsUseCase } from "./application/UpdateModelsUseCase.js";