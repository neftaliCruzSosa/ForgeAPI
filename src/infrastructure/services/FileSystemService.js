import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

class FileSystemService {
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
    await fs.mkdir(dirPath, { recursive: true });
  }

  async writeFile(filePath, content) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  async readDir(dirPath) {
    return await fs.readdir(dirPath);
  }

  async readFile(filePath) {
    return await fs.readFile(filePath, "utf-8");
  }

  async copyFile(sourcePath, targetPath) {
    return await fs.copyFile(sourcePath, targetPath);
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
