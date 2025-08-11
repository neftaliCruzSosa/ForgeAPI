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

export type ModelOption = "create" | "update" | "delete";

export interface UpdateModelsChange {
  option: ModelOption;
  entity: EntityDefinition;
}

export interface UpdateModelsOptions {
  projectName: string;
  changes: UpdateModelsChange[];
  services: Services;
}

export interface PrismaFieldRow {
  name: string;
  type: string;
  ref: string | null;
  required: boolean;
}

export interface PrismaProtectRow {
  method: any;
  authLevel: any;
}

export interface PrismaEntityRow {
  name: string;
  fields: PrismaFieldRow[];
  protect: PrismaProtectRow[];
}