import LoggerService from "../../infrastructure/services/LoggerService.js";
import TemplateService from "../../infrastructure/services/TemplateService.js";
import FileSystemService from "../../infrastructure/services/FileSystemService.js";

export function buildDefaultServices(projectName) {
  const logger = new LoggerService({ projectName });
  const fileService = new FileSystemService(logger);
  const templateService = new TemplateService(logger, fileService);

  return {
    logger,
    fileService,
    templateService,
  };
}
