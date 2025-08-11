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

  return {
    ...defaultConfig,
    ...externalConfig,
    ...options,
    projectName,
    outputDir,
    services:
      options.services ||
      externalConfig.services ||
      buildDefaultServices(projectName),
  };
}
