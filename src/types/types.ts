import type {
  SupportedCrudAction,
  AllowedProtectRole,
  SupportedDatabase,
  SupportedAuth,
  SupportedFramework,
  SupportedValidator,
} from "./config.js";

export interface EnvVar {
  key: string;
  value: string;
  comment?: string;
}

export type PackageDeps = Record<string, string>;

export interface PresetRoute {
  method: string;
  path: string;
  description?: string;
}

export interface PresetStructure {
  [name: string]: string | undefined;
}

export interface PresetControllerSnippets {
  [name: string]: string | undefined;
}

export interface AdapterPreset {
  label?: string;
  deps?: PackageDeps;
  env?: EnvVar[] | ((projectName: string) => EnvVar[]);
  routes?: PresetRoute[];
  controller?: PresetControllerSnippets;
  structure?: PresetStructure;
  middlewares?: string[];
  validation?: {
    ref?: Record<string, { joi?: string; zod?: string }>;
  };
}

export type AdapterPresets = Record<string, AdapterPreset>;

export interface AdapterConfig {
  services: Services;
  outputDir: string;
  entities?: EntityDefinition[];
  dbType?: string;
  authType?: string;
  framework?: string;
  validator?: string;
  projectName: string;
  author?: string;
}

export interface AdapterContext {
  config: AdapterConfig;
  templateDir?: string;
  presets?: AdapterPresets;
}

export interface AdapterInstance {
  generate(...args: unknown[]): Promise<unknown>;
}

export interface AdapterModule {
  default: new (ctx: AdapterContext) => AdapterInstance;
  preset: AdapterPreset;
}

export interface EntityField {
  name: string;
  type: string;
  required?: boolean;
  ref?: string;
}

export type EntityProtectRules = Record<
  SupportedCrudAction,
  AllowedProtectRole
>;

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
  dbType: SupportedDatabase;
  authType: SupportedAuth;
  framework: SupportedFramework;
  validator: SupportedValidator;
  author?: string;
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
  setContext(ctx: AdapterContext): void;
  render(templateName: string, data: Record<string, unknown>): Promise<string>;
}

export interface Services {
  logger: Logger;
  fileService: FileService;
  templateService: TemplateService;
}

export type LogLevel = "error" | "warn" | "info" | "debug";
