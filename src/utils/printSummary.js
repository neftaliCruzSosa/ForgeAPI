import {
  AUTH_CRUD_ROUTES,
  MODELS_CRUD_ROUTES,
} from "../config/default/constants.js";

export default function printSummary(ctx, models, startTime) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  const modelSummaries = models.map((m) => {
    const isBuiltIn = m.builtIn ? " [builtIn]" : "";
    return `${m.name}${isBuiltIn}`;
  });

  console.log("\nGENERATION SUMMARY");
  console.log("──────────────────────────────────────────────");
  console.log(`Project:       ${ctx?.config?.projectName}`);
  console.log(`Output Path:   ${ctx?.config?.outputDir}`);
  console.log(`Database:      ${ctx?.config?.dbType}`);
  console.log(`Auth:          ${ctx?.config?.authType || "none"}`);
  console.log(`Models:        ${models.length} (${modelSummaries.join(", ")})`);

  models.forEach((model) => {
    console.log(`  - ${model.name}${model.builtIn ? " [builtIn]" : ""}`);

    const protect = ctx.config.auth ? model.protect || {} : {};
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

  if (
    ctx.config.auth &&
    ctx.config.authType &&
    AUTH_CRUD_ROUTES[ctx.config.authType]
  ) {
    console.log(`Auth Routes:`);
    AUTH_CRUD_ROUTES[ctx.config.authType].forEach(
      ({ method, path, description }) => {
        console.log(
          `   ${method.padEnd(6)} ${path.padEnd(28)} (${description})`
        );
      }
    );
  }
  console.log(`Time:          ${duration}s`);
  console.log("──────────────────────────────────────────────\n");
}
