import type { EntityDefinition } from "types";

export default class EntityBuilder {
  async buildDefinition(entity: EntityDefinition): Promise<EntityDefinition> {
    if (!entity || typeof entity !== "object") {
      throw new Error("EntityBuilder: 'entity' must be an object.");
    }

    if (!entity.name || typeof entity.name !== "string") {
      throw new Error("EntityBuilder: 'entity.name' must be a non-empty string.");
    }

    const fields = Array.isArray(entity.fields) ? entity.fields : [];
    const fieldNames = new Set(fields.map((f) => f.name));

    const skipSet = new Set(entity.skipSystemFields || []);

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
      name: entity.name,
      fields,
    };
  }
}
