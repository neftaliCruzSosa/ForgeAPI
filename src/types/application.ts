import type { Services, EntityDefinition } from "./types.js";
import type {
  DefaultConfig,
  SupportedAuth,
  SupportedDatabase,
  SupportedFramework,
} from "./config.js";

export interface LoadConfigOptions {
  projectName?: string;
  entities?: EntityDefinition[];
  dbType?: SupportedDatabase;
  authType?: SupportedAuth;
  framework?: SupportedFramework;
  services?: Services;
  outputDir?: string | ((projectName: string) => string);
  force?: boolean;
}

export type LoadedConfig = Omit<DefaultConfig, "outputDir"> & {
  outputDir: string;
  projectName: string;
  services: Services;
};

export type GenerateApiConfig = LoadedConfig & {
  entities: EntityDefinition[];
};

export interface ValidateConfigOptions {
  projectName: string;
  entities: EntityDefinition[];
  dbType: SupportedDatabase;
  authType: SupportedAuth;
  framework: SupportedFramework;
  services: {
    fileService: Services["fileService"];
  };
  outputDir: string;
  force?: boolean;
}
