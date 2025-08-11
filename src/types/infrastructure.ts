import type {
  FileService,
  TemplateService,
  Logger,
  AdapterContext,
  EntityDefinition,
} from "./types.js";

export interface BaseFileGeneratorDeps {
  fileService: FileService;
  templateService: TemplateService;
  logger: Logger;
  ctx: AdapterContext & { config: { entities?: EntityDefinition[] } };
}
