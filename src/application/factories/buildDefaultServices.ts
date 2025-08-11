import LoggerService from "../../infrastructure/services/LoggerService.js";
import FileSystemService from "../../infrastructure/services/FileSystemService.js";
import TemplateService from "../../infrastructure/services/TemplateService.js";
import type { Services } from "types";

export function buildDefaultServices(projectName: string): Services {
  const logger = new LoggerService({ projectName, quiet: true });
  const fileService = new FileSystemService(logger);
  const templateService = new TemplateService(logger, fileService);

  return {
    logger,
    fileService,
    templateService,
  };
}
