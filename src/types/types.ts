import type { SupportedCrudAction, AllowedProtectRole } from "./config.js";

export interface EnvVar {
  key: string;
  value: string;
  comment?: string;
}

export interface AdapterConfig {
  services: {
    fileService: FileService;
    templateService: TemplateService;
    logger: Logger;
  };
  outputDir: string;
  entities?: EntityDefinition[];
  dbType?: string;
  authType?: string;
  framework?: string;
  projectName: string;
  auth?: boolean;
  author?:string;
}

export interface AdapterContext extends AnyRecord {
  config: AdapterConfig;
  templateDir?: string;
  presets?: Record<
    string,
    AnyRecord & {
      env?: EnvVar[] | ((projectName: string) => EnvVar[]);
    }
  >;
}

export interface AdapterInstance {
  generate(...args: unknown[]): Promise<unknown>;
}

export interface AdapterModule {
  default: new (ctx: AdapterContext) => AdapterInstance;
  preset: AnyRecord;
}

export type AnyRecord = Record<string, unknown>;

export interface EntityField {
  name: string;
  type: string;
  required?: boolean;
  ref?: string;
}

export type EntityProtectRules = Record<SupportedCrudAction, AllowedProtectRole>;

export interface BuiltField {
  name: string;
  type: string;
  required?: boolean;
  ref?: string;
  minlength?: number;
  maxlength?: number;
  unique?: boolean;
  default?: unknown;
}

export interface EntityDefinition {
  name: string;
  fields: BuiltField[];
  protect?: EntityProtectRules;
  skipSystemFields?: string[];
}

export interface ProjectConfig {
  projectName: string;
  outputDir: string;
  dbType: string;
  authType?: string;
  framework: string;
  author?: string;
  auth?: boolean;
}

export interface LoggerServiceOptions {
  level?: LogLevel;
  quiet?: boolean;
  logDir?: string;
  projectName?: string;
}

export interface FileService {
  resolvePath(...segments: string[]): string;
  joinPath(...segments: string[]): string;
  getCurrentDir(metaUrl: string): string;
  ensureDir(dirPath: string): Promise<void>;
  writeFile(filePath: string, content: string): Promise<void>;
  readDir(dirPath: string): Promise<string[]>;
  readFile(filePath: string): Promise<string>;
  copyFile(sourcePath: string, targetPath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
  pathExists(dirPath: string): Promise<boolean>;
  remove(targetPath: string): Promise<boolean>;
}

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export interface TemplateService {
  setContext(ctx: Record<string, unknown>): void;
  render(templateName: string, data: Record<string, unknown>): Promise<string>;
}

export interface Services {
  logger: Logger;
  fileService: FileService;
  templateService: TemplateService;
}

export type LogLevel = "error" | "warn" | "info" | "debug";
