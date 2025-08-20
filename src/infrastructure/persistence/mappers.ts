import { Method, Type, AuthLevel } from "@prisma/client";
import type { EntityDefinition } from "types";
import type { EntityProtectRules } from "types";
import type { SupportedCrudAction, AllowedProtectRole } from "types/config.js";

export function toPrismaType(t?: string | null): Type {
  const v = String(t ?? "").toLowerCase();
  switch (v) {
    case "string": return Type.STRING;
    case "number": return Type.NUMBER;
    case "boolean": return Type.BOOLEAN;
    case "array": return Type.ARRAY;
    case "ref": return Type.REF;
    default: return Type.STRING;
  }
}

export function toPrismaMethod(m?: string | null): Method | null {
  const v = String(m ?? "").toLowerCase();
  switch (v) {
    case "create": return Method.CREATE;
    case "getall": return Method.GET_ALL;
    case "getbyid": return Method.GET_BY_ID;
    case "update": return Method.UPDATE;
    case "delete": return Method.DELETE;
    case "restore": return Method.RESTORE;
    case "harddelete": return Method.HARD_DELETE;
    default: return null;
  }
}

export function toPrismaAuthLevel(a?: string | null): AuthLevel | null {
  const v = String(a ?? "").toLowerCase();
  if (v === "admin") return AuthLevel.ADMIN;
  if (v === "auth")  return AuthLevel.AUTH;
  if (v === "self")  return AuthLevel.SELF;
  return null;
}

export function fieldsToRows(fields: EntityDefinition["fields"]) {
  if (!Array.isArray(fields)) return [];
  return fields.map((f) => ({
    name: f.name,
    type: toPrismaType(f.type),
    ref: f.ref ?? null,
    required: !!f.required,
  }));
}

export function rulesToProtectRows(
  rules: Record<string, string | string[]> | undefined
): { method: Method; authLevel: AuthLevel }[] {
  if (!rules || typeof rules !== "object") return [];
  const out: { method: Method; authLevel: AuthLevel }[] = [];
  for (const [k, v] of Object.entries(rules)) {
    const method = toPrismaMethod(k);
    if (!method) continue;
    const levels = Array.isArray(v) ? v : [v];
    for (const level of levels) {
      const authLevel = toPrismaAuthLevel(level);
      if (authLevel) out.push({ method, authLevel });
    }
  }
  return out;
}

export function protectRowsToRules(
  rows: { method: Method; authLevel: AuthLevel }[] | undefined
): EntityProtectRules | undefined {
  if (!rows || rows.length === 0) return undefined;
  const out: Partial<Record<SupportedCrudAction, AllowedProtectRole>> = {};
  for (const r of rows) {
    const method = r.method.toLowerCase() as SupportedCrudAction;
    const level  = r.authLevel.toLowerCase() as AllowedProtectRole;
    out[method] = level;
  }
  return out as EntityProtectRules;
}
