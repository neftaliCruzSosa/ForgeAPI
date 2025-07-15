import fs from "fs/promises";
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
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export default FileSystemService;
