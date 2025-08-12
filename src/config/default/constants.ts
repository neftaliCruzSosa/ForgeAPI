export const SUPPORTED_DATABASES = ["mongo", "postgres"] as const;
export const SUPPORTED_AUTHS = ["jwt", "ironSession"] as const;
export const SUPPORTED_FRAMEWORKS = ["express"] as const;
export const SUPPORTED_VALIDATORS = ["joi"] as const;

export const SUPPORTED_CRUD_ACTIONS = [
  "create",
  "getAll",
  "getById",
  "update",
  "delete",
  "restore",
  "hardDelete",
] as const;

export const ALLOWED_PROTECT_ROLES = ["admin", "auth", "self"] as const;

export const MODELS_CRUD_ROUTES = [
  { action: "create", method: "POST", path: "/" },
  { action: "getAll", method: "GET", path: "/" },
  { action: "getById", method: "GET", path: "/:id" },
  { action: "update", method: "PUT", path: "/:id" },
  { action: "delete", method: "DELETE", path: "/:id" },
  { action: "restore", method: "PATCH", path: "/:id" },
  { action: "hardDelete", method: "DELETE", path: "/:id/hardDelete" },
] as const;