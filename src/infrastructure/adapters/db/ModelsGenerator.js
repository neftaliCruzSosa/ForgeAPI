import BaseFileGenerator from "../../shared/BaseFileGenerator.js";
import EntityValidator from "../../../domain/services/EntityValidator.js";

class ModelGenerator extends BaseFileGenerator {
  constructor({ fileService, templateService, logger }) {
    super({ fileService, templateService, logger });
  }

  async generate(entities, basePath, dbGenerator) {
    const validator = new EntityValidator();
    validator.validate(entities);
    let generatedModels = [];
    try {
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        await dbGenerator?.generate(entity, basePath);
        generatedModels.push(entity);
      }
      this.logger.info("Models generated successfully.");
    } catch (err) {
      this.logger.error(`Error generating models: ${err.message}`);
      throw err;
    }
    return generatedModels;
  }
}

export default ModelGenerator;
