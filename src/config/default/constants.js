export const SUPPORTED_DATABASES = ["mongo", "postgres"];
export const SUPPORTED_AUTHS = ["jwt", "ironSession"];
export const SUPPORTED_FRAMEWORKS = ["express"];
export const SUPPORTED_CRUD_ACTIONS = [
  "create",
  "getAll",
  "getById",
  "update",
  "delete",
  "restore",
  "hardDelete",
];
export const ALLOWED_PROTECT_ROLES = ["admin", "auth", "self"];
export const MODELS_CRUD_ROUTES = [
  { action: "create", method: "POST", path: "/" },
  { action: "getAll", method: "GET", path: "/" },
  { action: "getById", method: "GET", path: "/:id" },
  { action: "update", method: "PUT", path: "/:id" },
  { action: "delete", method: "DELETE", path: "/:id" },
  { action: "restore", method: "PATCH", path: "/:id" },
  { action: "hardDelete", method: "DELETE", path: "/:id/hardDelete" },
];
export const AUTH_CRUD_ROUTES = {
  jwt: [
    { method: "POST", path: "/auth/register", description: "register" },
    { method: "POST", path: "/auth/login", description: "login" },
    {
      method: "PUT",
      path: "/auth/promote/:username",
      description: "promote user to admin [admin]",
    },
  ],

  ironSession: [
    { method: "POST", path: "/auth/register", description: "register" },
    { method: "POST", path: "/auth/login", description: "login" },
    { method: "POST", path: "/auth/logout", description: "logout" },
    {
      method: "GET",
      path: "/auth/profile",
      description: "get session user [auth]",
    },
    {
      method: "PUT",
      path: "/auth/promote/:username",
      description: "promote user to admin [admin]",
    },
  ],
};
