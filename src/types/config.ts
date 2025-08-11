export type SupportedDatabase =
  (typeof import("../config/default/constants.js").SUPPORTED_DATABASES)[number];

export type SupportedAuth =
  (typeof import("../config/default/constants.js").SUPPORTED_AUTHS)[number];

export type SupportedFramework =
  (typeof import("../config/default/constants.js").SUPPORTED_FRAMEWORKS)[number];

export type SupportedCrudAction =
  (typeof import("../config/default/constants.js").SUPPORTED_CRUD_ACTIONS)[number];

export type AllowedProtectRole =
  (typeof import("../config/default/constants.js").ALLOWED_PROTECT_ROLES)[number];

export interface DefaultConfig {
  dbType: SupportedDatabase;
  authType: SupportedAuth;
  auth: boolean;
  framework: SupportedFramework;
  force: boolean;
  author: string;
  outputDir: string | ((projectName: string) => string);
  templateDir: string;
}
