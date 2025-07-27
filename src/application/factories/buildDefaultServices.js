import LoggerService from "../../infrastructure/services/LoggerService.js";
import TemplateService from "../../infrastructure/services/TemplateService.js";
import FileSystemService from "../../infrastructure/services/FileSystemService.js";

export function buildDefaultServices(projectName) {
  const logger = new LoggerService({ projectName });

  return {
    logger,
    templateService: new TemplateService(logger),
    fileService: new FileSystemService(logger),
  };
}
