import type {
  FileService,
  TemplateService,
  Logger,
  AdapterContext
} from "./types.js";

export interface BaseFileGeneratorDeps {
  fileService: FileService;
  templateService: TemplateService;
  logger: Logger;
  ctx: AdapterContext;
}
