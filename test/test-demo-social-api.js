import forgeAPI from "../src/index.js";

/* --- (Optional) Utilities for non-core features --- */
import FileSystemService from "../src/infrastructure/services/FileSystemService.js";
const fileService = new FileSystemService();
/* --------------------------------------------------- */

const args = process.argv.slice(2);
const params = {};
args.forEach((arg) => {
  const [key, value] = arg.split("=");
  params[key] = value;
});

const authType = params.authType || "jwt";
const dbType = params.dbType || "mongo";
const auth = params.auth === "false" ? false : true;
const force = params.force === "false" ? false : true;

// Define your entities (required)
const entities = [
  {
    name: "User",
    builtIn: true,
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
try {
  await forgeAPI({
    projectName: "demo-social-api",
    entities,
    auth,
    dbType,
    authType,
    force,
  });

  /* --- Optional: Copy seed.js into test project --- */
  const seedSourcePath = fileService.resolvePath(
    fileService.getCurrentDir(import.meta.url),
    dbType,
    "seed.js"
  );
  const seedTargetPath = fileService.resolvePath(
    fileService.getCurrentDir(import.meta.url),
    "../projects/demo-social-api/seed.js"
  );

  await fileService.copyFile(seedSourcePath, seedTargetPath);
  /* ---------------------------------------------------- */
} catch (err) {
  console.error(err.message);
}
