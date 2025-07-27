import path from "path";
import { existsSync } from "fs";

const rootDir = path.resolve();

export default async (type, name, config) => {
  const localPath = path.join(
    rootDir,
    "src",
    "infrastructure",
    "adapters",
    type,
    name,
    "generator.js"
  );

  if (!existsSync(localPath)) {
    throw new Error(`Adapter not found for ${type}:${name}`);
  }

  const module = await import(`file://${localPath}`);
  const Generator = module.default;

  return {
    generator: new Generator(config),
  };
};
