import fs from "fs/promises";
import { constants } from "fs";
import path from "path";
import { fileURLToPath } from "url";

class FileSystemService {
  constructor(logger = console) {
    this.logger = logger;
  }

  resolvePath(...segments) {
    return path.resolve(...segments);
  }

  joinPath(...segments) {
    return path.join(...segments);
  }

  getCurrentDir(metaUrl) {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
  }

  async ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
      this.logger.error(
        `Failed to create directory "${dirPath}": ${err.message}`
      );
      throw err;
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, "utf-8");
    } catch (err) {
      this.logger.error(`Failed to write file "${filePath}": ${err.message}`);
      throw err;
    }
  }

  async readDir(dirPath) {
    try {
      return await fs.readdir(dirPath);
    } catch (err) {
      this.logger.error(
        `Failed to read directory "${dirPath}": ${err.message}`
      );
      throw err;
    }
  }

  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (err) {
      this.logger.error(`Failed to read file "${filePath}": ${err.message}`);
      throw err;
    }
  }

  async copyFile(sourcePath, targetPath) {
    try {
      await fs.copyFile(sourcePath, targetPath);
    } catch (err) {
      this.logger.error(
        `Failed to copy from "${sourcePath}" to "${targetPath}": ${err.message}`
      );
      throw err;
    }
  }

  async exists(filePath) {
    try {
      await fs.access(filePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async pathExists(dirPath) {
    try {
      await fs.access(dirPath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async remove(targetPath) {
    try {
      await fs.rm(targetPath, { recursive: true, force: true });
      return true;
    } catch (err) {
      this.logger.error(`Failed to remove "${targetPath}": ${err.message}`);
      return false;
    }
  }
}

export default FileSystemService;
