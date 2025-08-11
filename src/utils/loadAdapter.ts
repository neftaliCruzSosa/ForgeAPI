import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { AdapterModule, AdapterInstance, AdapterContext } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcRoot = path.resolve(__dirname, "..");
const projRoot = path.resolve(srcRoot, "..");
const distRoot = path.join(projRoot, "dist");

function resolveAdapterFile(type: string, name: string): string {
  const candidates = [
    // build
    path.join(distRoot, "infrastructure", "adapters", type, name, "index.js"),
    // dev
    path.join(srcRoot, "infrastructure", "adapters", type, name, "index.ts"),
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  throw new Error(
    `Adapter not found for ${type}:${name}. Tried:\n  - ${candidates.join("\n  - ")}`
  );
}

export default async function loadAdapter(
  type: string,
  name: string,
  ctx: AdapterContext
): Promise<{ generator: AdapterInstance; preset: Record<string, unknown> }> {
  const filePath = resolveAdapterFile(type, name);
  const fileUrl = pathToFileURL(filePath).href;

  const ns = await import(fileUrl);
  const mod = ns.default as AdapterModule;

  if (typeof mod.default !== "function") {
    throw new Error(
      `Adapter ${type}:${name} must export a default class/function (got ${typeof mod.default}).`
    );
  }
  if (!mod.preset || typeof mod.preset !== "object") {
    throw new Error(`Adapter ${type}:${name} must export a 'preset' object.`);
  }

  const instance = new mod.default(ctx);
  if (typeof (instance as any).generate !== "function") {
    throw new Error(`Adapter ${type}:${name} is missing 'generate()' method.`);
  }

  ctx.presets ??= {};
  ctx.presets[type] = mod.preset;

  return {
    generator: instance,
    preset: mod.preset,
  };
}
