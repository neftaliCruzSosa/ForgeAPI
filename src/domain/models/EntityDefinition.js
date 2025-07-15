class EntityDefinition {
  constructor(name, fields = []) {
    if (!name || typeof name !== "string") {
      throw new Error("EntityDefinition: 'name' must be a non-empty string.");
    }

    if (!Array.isArray(fields)) {
      throw new Error("EntityDefinition: 'fields' must be an array.");
    }

    this.name = name;
    this.fields = fields;
  }
}

export default EntityDefinition;
