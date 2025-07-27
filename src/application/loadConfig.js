import fs from "fs";
import path from "path";
import defaultConfig from "../config/defaultConfig.js";
import { buildDefaultServices } from "./factories/buildDefaultServices.js";

export async function loadConfig(options = {}) {
  let externalConfig = {};
  const configPath = path.resolve("forge.config.json");

  if (fs.existsSync(configPath)) {
    try {
      externalConfig = JSON.parse(
        await fs.promises.readFile(configPath, "utf-8")
      );
    } catch (err) {
      console.warn(`Could not read forge.config.json: ${err.message}`);
    }
  }

  const projectName = options.projectName || externalConfig.projectName;
  return {
    ...defaultConfig,
    ...externalConfig,
    ...options,
    projectName,
    outputDir:
      options.outputDir ||
      externalConfig.outputDir ||
      defaultConfig.outputDir(projectName),
    services:
      options.services ||
      externalConfig.services ||
      buildDefaultServices(projectName),
  };
}
