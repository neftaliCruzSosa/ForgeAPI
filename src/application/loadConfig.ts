import fs from "fs";
import path from "path";
import defaultConfig from "../config/defaultConfig.js";
import { buildDefaultServices } from "./factories/buildDefaultServices.js";
import { resolveOutputDir } from "../utils/resolveOutputDir.js";
import type {
  LoadConfigOptions,
  LoadedConfig,
  DefaultConfig,
  Services,
} from "types";

export async function loadConfig(options: LoadConfigOptions = {}): Promise<LoadedConfig> {

  let externalConfig: Partial<DefaultConfig> & {
    projectName?: string;
    services?: Services;
  } = {};

  const configPath = path.resolve("forge.config.json");
  if (fs.existsSync(configPath)) {
    try {
      externalConfig = JSON.parse(
        await fs.promises.readFile(configPath, "utf-8")
      ) as typeof externalConfig;
    } catch (err) {
      console.warn(
        `Could not read forge.config.json: ${(err as Error).message}`
      );
    }
  }

  const projectName =
    options.projectName || externalConfig.projectName || "unnamed";

  const outputDir = resolveOutputDir({
    outputDir:
      options.outputDir ??
      externalConfig.outputDir ??
      defaultConfig.outputDir,
    projectName,
  });

  const services =
  options.services ??
  externalConfig.services ??
  buildDefaultServices(projectName);

const entities =
  options.entities ?? [];

const dbType =
  options.dbType ?? externalConfig.dbType ?? defaultConfig.dbType;

const authType =
  options.authType ?? externalConfig.authType ?? defaultConfig.authType;

const framework =
  options.framework ?? externalConfig.framework ?? defaultConfig.framework;

const validator =
  options.validator ?? externalConfig.validator ?? defaultConfig.validator;

const force =
  options.force ?? externalConfig.force ?? defaultConfig.force ?? false;

return {
  projectName,
  outputDir,
  services,
  entities,
  dbType,
  authType,
  framework,
  validator,
  force,
}
}
