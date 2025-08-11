import {
  AUTH_CRUD_ROUTES,
  MODELS_CRUD_ROUTES,
} from "../config/default/constants.js";

import type {
  AdapterContext,
  EntityDefinition,
  SupportedAuth,
  SupportedCrudAction,
  AllowedProtectRole,
  EntityProtectRules,
} from "../types";

export default function printSummary(
  ctx: AdapterContext,
  models: EntityDefinition[],
  startTime: number
): void {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\nGENERATION SUMMARY");
  console.log("──────────────────────────────────────────────");
  console.log(`Project:       ${ctx?.config?.projectName}`);
  console.log(`Output Path:   ${ctx?.config?.outputDir}`);
  console.log(`Database:      ${ctx?.config?.dbType}`);
  console.log(
    `Auth:          ${(ctx?.config?.auth && ctx?.config?.authType) || "none"}`
  );
  console.log(
    `Models:        ${models.length} (${models.map((m) => m.name).join(", ")})`
  );

  models.forEach((model) => {
    console.log(`  - ${model.name}`);

    const protect: EntityProtectRules = ctx.config.auth
      ? (model.protect ?? ({} as EntityProtectRules))
      : ({} as EntityProtectRules);

    const base = `/${model.name.toLowerCase()}`;

    MODELS_CRUD_ROUTES.forEach((route) => {
      const { action, method, path } = route as {
        action: SupportedCrudAction;
        method: string;
        path: string;
      };

      const fullPath = base + path;
      
      const role: AllowedProtectRole | undefined = protect[action];
      
      const tag = role ? ` [${role}]` : "";
      console.log(
        `     ${method.padEnd(6)} ${fullPath.padEnd(24)} (${action})${tag}`
      );
    });
  });

  if (ctx.config.auth && ctx.config.authType) {
    console.log(`Auth Routes:`);
    const authRoutes = AUTH_CRUD_ROUTES[
      ctx.config.authType as SupportedAuth
    ] as readonly {
      method: string;
      path: string;
      description: string;
    }[];

    authRoutes.forEach(({ method, path, description }) => {
      console.log(`   ${method.padEnd(6)} ${path.padEnd(28)} (${description})`);
    });
  }

  console.log(`Time:          ${duration}s`);
  console.log("──────────────────────────────────────────────\n");
}
