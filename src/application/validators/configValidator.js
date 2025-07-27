import {
  SUPPORTED_DATABASES,
  SUPPORTED_AUTHS,
  SUPPORTED_FRAMEWORKS,
} from "../../config/default/constants.js";

export async function validateConfig({
  projectName,
  entities,
  dbType,
  authType,
  framework,
  services,
  outputDir,
  force,
}) {
  if (!projectName || typeof projectName !== "string") {
    throw new Error("Invalid or missing 'projectName'.");
  }

  if (!Array.isArray(entities) || entities.length === 0) {
    throw new Error("Entity list is empty or invalid.");
  }

  if (!SUPPORTED_DATABASES.includes(dbType)) {
    throw new Error(
      `Unsupported database type: "${dbType}". Supported: ${SUPPORTED_DATABASES.join(
        ", "
      )}`
    );
  }

  if (!SUPPORTED_AUTHS.includes(authType)) {
    throw new Error(
      `Unsupported auth type: "${authType}". Supported: ${SUPPORTED_AUTHS.join(
        ", "
      )}`
    );
  }

  if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
    throw new Error(
      `Unsupported framework type: "${framework}". Supported: ${SUPPORTED_FRAMEWORKS.join(
        ", "
      )}`
    );
  }

  if (await services.fileService.pathExists(outputDir)) {
    if (!force) {
      throw new Error(
        `Project '${projectName}' already exists. Use 'force: true' to overwrite it.`
      );
    }
    await services.fileService.remove(outputDir);
  }
}
