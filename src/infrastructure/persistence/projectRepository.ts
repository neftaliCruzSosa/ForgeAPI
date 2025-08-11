import prisma from "./prisma/client.js";
import { Method, Type, AuthLevel } from "@prisma/client";
import EntityBuilder from "../../domain/services/EntityBuilder.js";
import type { EntityDefinition } from "types";

function mapType(t: string | undefined | null): Type {
  const v = String(t || "").toLowerCase();
  switch (v) {
    case "string":
      return Type.STRING;
    case "number":
      return Type.NUMBER;
    case "boolean":
      return Type.BOOLEAN;
    case "array":
      return Type.ARRAY;
    case "ref":
      return Type.REF;
    default:
      return Type.STRING;
  }
}

function mapMethod(m: string | undefined | null): Method | null {
  const v = String(m || "").toLowerCase();
  switch (v) {
    case "create":
      return Method.CREATE;
    case "getall":
      return Method.GET_ALL;
    case "getbyid":
      return Method.GET_BY_ID;
    case "update":
      return Method.UPDATE;
    case "delete":
      return Method.DELETE;
    case "restore":
      return Method.RESTORE;
    case "harddelete":
      return Method.HARD_DELETE;
    default:
      return null;
  }
}

function mapAuthLevel(a: string | undefined | null): AuthLevel | null {
  const v = String(a || "").toLowerCase();
  if (v === "admin") return AuthLevel.ADMIN;
  if (v === "auth") return AuthLevel.AUTH;
  if (v === "self") return AuthLevel.SELF;
  return null;
}

function normalizeFields(fields: EntityDefinition["fields"]) {
  if (!Array.isArray(fields)) return [];
  return fields.map((f) => ({
    name: f.name,
    type: mapType(f.type),
    ref: f.ref ?? null,
    required: !!f.required,
  }));
}

function normalizeProtect(
  protect: Record<string, string | string[]> | undefined
) {
  if (protect && typeof protect === "object") {
    const out: { method: Method; authLevel: AuthLevel }[] = [];
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

interface SaveOrUpdateProjectParams {
  config: any;
  models: EntityDefinition[];
}

export async function saveOrUpdateProject({
  config,
  models,
}: SaveOrUpdateProjectParams) {
  const builder = new EntityBuilder();

  const byName = new Map<string, EntityDefinition>(
  (models || []).map((m) => [m.name, m])
);

  const resolved: EntityDefinition[] = [];
  for (const m of models || []) {
    const def = await builder.buildDefinition(m);
    const original = byName.get(def.name) ?? ({} as EntityDefinition);
    resolved.push({
      name: def.name,
      fields: def.fields || [],
      protect: original.protect,
    });
  }

  const entitiesData = resolved.map((m) => ({
    name: m.name,
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
