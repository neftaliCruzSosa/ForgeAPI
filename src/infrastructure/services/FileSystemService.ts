import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Logger } from "types";

export default class FileSystemService {
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  resolvePath(...segments: string[]): string {
    return path.resolve(...segments);
  }

  joinPath(...segments: string[]): string {
    return path.join(...segments);
  }

  getCurrentDir(metaUrl: string): string {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
  }

  async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
      this.logger?.error(
        `Failed to create directory "${dirPath}": ${(err as Error).message}`
      );
      throw err;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, "utf-8");
    } catch (err) {
      this.logger?.error(
        `Failed to write file "${filePath}": ${(err as Error).message}`
      );
      throw err;
    }
  }

  async readDir(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (err) {
      this.logger?.error(
        `Failed to read directory "${dirPath}": ${(err as Error).message}`
      );
      throw err;
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (err) {
      this.logger?.error(
        `Failed to read file "${filePath}": ${(err as Error).message}`
      );
      throw err;
    }
  }

  async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await fs.copyFile(sourcePath, targetPath);
    } catch (err) {
      this.logger?.error(
        `Failed to copy from "${sourcePath}" to "${targetPath}": ${(err as Error).message}`
      );
      throw err;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async pathExists(dirPath: string): Promise<boolean> {
    try {
      await fs.access(dirPath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async remove(targetPath: string): Promise<boolean> {
    try {
      await fs.rm(targetPath, { recursive: true, force: true });
      return true;
    } catch (err) {
      this.logger?.error(
        `Failed to remove "${targetPath}": ${(err as Error).message}`
      );
      return false;
    }
  }
}
