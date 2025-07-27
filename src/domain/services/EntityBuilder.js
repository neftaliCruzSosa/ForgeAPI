class EntityBuilder {
  constructor({ fileService, logger }) {
    this.fileService = fileService;
    this.logger = logger;
  }
  async buildDefinition(entity) {
    if (!entity || typeof entity !== "object") {
      throw new Error("EntityBuilder: 'entity' must be an object.");
    }

    if (!entity.name || typeof entity.name !== "string") {
      throw new Error(
        "EntityBuilder: 'entity.name' must be a non-empty string."
      );
    }

    let baseDefinition = entity;

    if (entity.builtIn) {
      const defPath = this.fileService.resolvePath(
        "src/templates/models/builtIn",
        `${entity.name}.json`
      );
      
      const exists = await this.fileService.exists(defPath);
      if (!exists) {
        this.logger?.warn(`No built-in definition found for ${entity.name}`);
        return;
      }

      const raw = await this.fileService.readFile(defPath);
      const parsed = JSON.parse(raw);

      baseDefinition = {
        ...parsed,
        overrideFields: Array.isArray(entity.overrideFields)
          ? entity.overrideFields
          : [],
        skipSystemFields: Array.from(
          new Set([
            ...(parsed.skipSystemFields || []),
            ...(entity.skipSystemFields || []),
          ])
        ),
      };
    }

    const userFields = Array.isArray(baseDefinition.fields) ? baseDefinition.fields : [];
    const overrideFields = Array.isArray(baseDefinition.overrideFields)
      ? baseDefinition.overrideFields
      : [];
    const merged = new Map(userFields.map((f) => [f.name, f]));
    for (const override of overrideFields) {
      merged.set(override.name, override);
    }

    let fields = Array.from(merged.values());

    const fieldNames = new Set(fields.map((f) => f.name));

    const skipSet = new Set(baseDefinition.skipSystemFields);

    const systemFields = [
      { name: "isDeleted", type: "Boolean", default: false },
      { name: "createdBy", type: "ref", ref: "User", required: true },
    ];

    for (const sysField of systemFields) {
      if (!fieldNames.has(sysField.name) && !skipSet.has(sysField.name)) {
        fields.push(sysField);
      }
    }

    return {
      name: baseDefinition.name,
      fields,
    };
  }
}

export default EntityBuilder;
