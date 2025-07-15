import forgeAPI from "../src/index.js";

/* --- (Optional) Utilities for non-core features --- */
import FileSystemService from "../src/infrastructure/services/FileSystemService.js";
const fileService = new FileSystemService();
/* --------------------------------------------------- */

// Define your entities (required)
const entities = [
  {
    name: "User",
    builtIn: true,
    generateCrud: true,
    skipSystemFields: ["createdBy"],
    overrideFields: [
      { name: "bio", type: "String" },
      { name: "avatar", type: "String" },
    ],
    protect: {
      create: "admin",
      getAll: "admin",
      getById: "admin",
      update: "self",
      delete: "admin",
    },
  },
  {
    name: "Post",
    fields: [
      { name: "title", type: "String", required: true },
      { name: "content", type: "String" },
      { name: "tags", type: "Array" },
    ],
    protect: {
      create: "auth",
      update: "self",
      delete: "self",
      restore: "admin",
      hardDelete: "admin",
    },
  },
  {
    name: "Comment",
    fields: [
      { name: "text", type: "String", required: true },
      { name: "post", type: "ref", ref: "Post", required: true },
    ],
    protect: {
      create: "auth",
      update: "self",
      delete: "self",
      restore: "admin",
      hardDelete: "admin",
    },
  },
  {
    name: "Like",
    fields: [{ name: "post", type: "ref", ref: "Post", required: true }],
    protect: {
      create: "auth",
      delete: "self",
    },
  },
];

// Core: Generate the API project
await forgeAPI({
  projectName: "demo-social-api",
  entities,
  auth: true,
  dbType: "postgres",
  authType: "ironSession",
});

/* --- Optional: Copy seed.js into test project --- */
const seedSourcePath = fileService.resolvePath(
  fileService.getCurrentDir(import.meta.url),
  "seed.js"
);
const seedTargetPath = fileService.resolvePath(
  fileService.getCurrentDir(import.meta.url),
  "../projects/demo-social-api/seed.js"
);

await fileService.copyFile(seedSourcePath, seedTargetPath);
console.log("✅ seed.js copied to test project");
/* ---------------------------------------------------- */