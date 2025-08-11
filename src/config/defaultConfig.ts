import type {
  DefaultConfig,
} from "types";

import {
  SUPPORTED_DATABASES,
  SUPPORTED_AUTHS,
  SUPPORTED_FRAMEWORKS,
} from "./default/constants.js";

const defaultConfig: DefaultConfig = {
  dbType: SUPPORTED_DATABASES[0],
  authType: SUPPORTED_AUTHS[0],
  auth: false,
  framework: SUPPORTED_FRAMEWORKS[0],
  force: false,
  author: "unknown",
  outputDir: (projectName: string) => `./projects/${projectName}`,
  templateDir: "./src/templates",
};

export default defaultConfig;
