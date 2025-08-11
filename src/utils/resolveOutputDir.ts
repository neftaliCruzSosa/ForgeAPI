import type { DefaultConfig } from "../types/config";

export function resolveOutputDir(
  cfg: Pick<DefaultConfig, "outputDir"> & { projectName: string }
): string {
  const { outputDir, projectName } = cfg;
  return typeof outputDir === "function" ? outputDir(projectName) : outputDir;
}
