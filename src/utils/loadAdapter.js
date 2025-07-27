import path from "path";
import { existsSync } from "fs";

const rootDir = path.resolve();

export default async (type, name, ctx = {}) => {
  const localPath = path.join(
    rootDir,
    "src",
    "infrastructure",
    "adapters",
    type,
    name,
    "index.js"
  );

  if (!existsSync(localPath)) {
    throw new Error(`Adapter not found for ${type}:${name}`);
  }

  const module = await import(`file://${localPath}`);
  const Generator = module.default;
  const preset = module.preset;

  if (!Generator || typeof Generator !== "function") {
    throw new Error(
      `Adapter ${type}:${name} does not export a default class/function`
    );
  }
  if (!Generator.prototype.generate) {
    throw new Error(`Adapter ${type}:${name} is missing "generate()" method`);
  }

  if (ctx && preset) {
    ctx.presets ??= {};
    ctx.presets[type] = preset;
  }

  return {
    generator: new Generator(ctx),
    preset,
  };
};
