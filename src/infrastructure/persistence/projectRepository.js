import prisma from "./prisma/client.js";
import EntityBuilder from "../../domain/services/EntityBuilder.js";

function mapType(t) {
  const v = String(t || "").toLowerCase();
  switch (v) {
    case "string":
      return "STRING";
    case "number":
      return "NUMBER";
    case "boolean":
      return "BOOLEAN";
    case "array":
      return "ARRAY";
    case "ref":
      return "REF";
    default:
      return "STRING";
  }
}

function mapMethod(m) {
  const v = String(m || "").toLowerCase();
  switch (v) {
    case "create":
      return "CREATE";
    case "getall":
      return "GET_ALL";
    case "getById":
      return "GET_BY_ID";
    case "update":
      return "UPDATE";
    case "delete":
      return "DELETE";
    case "restore":
      return "RESTORE";
    case "hardDelete":
      return "HARD_DELETE";
    default:
      return null;
  }
}

function mapAuthLevel(a) {
  const v = String(a || "").toLowerCase();
  if (v === "admin") return "ADMIN";
  if (v === "auth") return "AUTH";
  if (v === "self") return "SELF";
  return null;
}

function normalizeFields(fields) {
  if (!Array.isArray(fields)) return [];
  return fields.map((f) => ({
    name: f.name,
    type: mapType(f.type),
    ref: f.ref ?? null,
    required: !!f.required,
  }));
}

function normalizeProtect(protect) {
  if (protect && typeof protect === "object") {
    const out = [];
    for (const [k, v] of Object.entries(protect)) {
      const method = mapMethod(k);
      if (!method) continue;
      const roles = Array.isArray(v) ? v : [v];
      for (const role of roles) {
        const authLevel = mapAuthLevel(role);
        if (authLevel) out.push({ method, authLevel });
      }
    }
    return out;
  }

  return [];
}

export async function saveOrUpdateProject({ config, models }) {
  const builder = new EntityBuilder({
    fileService: config.services?.fileService,
    logger: config.services?.logger,
  });

  const byName = new Map((models || []).map((m) => [m.name, m]));

  const resolved = [];
  for (const m of models || []) {
    const def = await builder.buildDefinition(m);
    const original = byName.get(def.name) || {};
    resolved.push({
      name: def.name,
      builtIn: !!original.builtIn,
      fields: def.fields || [],
      protect: original.protect,
    });
  }

  const entitiesData = resolved.map((m) => ({
    name: m.name,
    builtIn: !!m.builtIn,
    fields: { create: normalizeFields(m.fields) },
    protect: { create: normalizeProtect(m.protect) },
  }));

  const data = {
    name: config.projectName,
    outputDir: config.outputDir,
    dbType: config.dbType,
    authType: config.authType,
    framework: config.framework,
    author: config.author ?? null,
    auth: !!config.auth,
    entities: { create: entitiesData },
  };

  const existing = await prisma.proyect.findUnique({
    where: { name: data.name },
    select: { id: true },
  });

  if (!existing) {
    return prisma.proyect.create({ data });
  }

  await prisma.entity.deleteMany({ where: { proyectId: existing.id } });

  return prisma.proyect.update({
    where: { id: existing.id },
    data: {
      outputDir: data.outputDir,
      dbType: data.dbType,
      authType: data.authType,
      framework: data.framework,
      author: data.author,
      auth: data.auth,
      entities: { create: entitiesData },
    },
  });
}
