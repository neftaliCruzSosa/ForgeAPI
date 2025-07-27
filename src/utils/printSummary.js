import { AUTH_CRUD_ROUTES, MODELS_CRUD_ROUTES } from "../config/constants.js";

export default function printSummary({
  projectName,
  outputPath,
  dbType,
  authType,
  auth,
  models = [],
  files = [],
  startTime,
}) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  const modelSummaries = models.map((m) => {
    const isBuiltIn = m.builtIn ? " [builtIn]" : "";
    return `${m.name}${isBuiltIn}`;
  });

  const fileList =
    files.length > 0 ? files.join(", ") : ".env.example, app.js, README";

  console.log("\nGENERATION SUMMARY");
  console.log("──────────────────────────────────────────────");
  console.log(`Project:       ${projectName}`);
  console.log(`Output Path:   ${outputPath}`);
  console.log(`Database:      ${dbType}`);
  console.log(`Auth:          ${authType || "none"}`);
  console.log(`Models:        ${models.length} (${modelSummaries.join(", ")})`);

  models.forEach((model) => {
    console.log(`  - ${model.name}${model.builtIn ? " [builtIn]" : ""}`);

    const protect = auth ? model.protect || {} : {};
    const base = `/${model.name.toLowerCase()}`;

    MODELS_CRUD_ROUTES.forEach(({ action, method, path }) => {
      const fullPath = base + path;
      const role = protect[action];
      const tag = role ? ` [${role}]` : "";
      console.log(
        `     ${method.padEnd(6)} ${fullPath.padEnd(24)} (${action})${tag}`
      );
    });
  });

  if (auth && authType && AUTH_CRUD_ROUTES[authType]) {
    console.log(`Auth Routes:`);
    AUTH_CRUD_ROUTES[authType].forEach(({ method, path, description }) => {
      console.log(`   ${method.padEnd(6)} ${path.padEnd(28)} (${description})`);
    });
  }

  console.log(`Files:         ${fileList}`);
  console.log(`Time:          ${duration}s`);
  console.log("──────────────────────────────────────────────\n");
}
