import path from "path";
import { existsSync } from "fs";

const rootDir = path.resolve();

export default async (type, config) => {
  const localPath = path.join(
    rootDir,
    "src",
    "infrastructure",
    "adapters",
    type,
    "generator.js"
  );

  if (!existsSync(localPath)) {
    throw new Error(`Adapter not found for ${type}`);
  }

  const module = await import(`file://${localPath}`);
  const Generator = module.default;

  return {
    generator: new Generator(config),
  };
};
