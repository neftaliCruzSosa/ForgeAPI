import {
  ALLOWED_PROTECT_ROLES,
  SUPPORTED_CRUD_ACTIONS,
} from "../../config/constants.js";

class EntityValidator {
  validate(entities) {
    if (!Array.isArray(entities)) {
      throw new Error("Entities must be an array.");
    }

    const entityNames = new Set(entities.map((e) => e.name));

    for (const entity of entities) {
      this.#validateEntity(entity, entityNames);
    }
  }

  #validateEntity(entity, allEntityNames) {
    if (!entity.name || typeof entity.name !== "string") {
      throw new Error(
        `Entity is missing a valid 'name': ${JSON.stringify(entity)}`
      );
    }

    const fieldKey = entity.builtIn ? "overrideFields" : "fields";
    const fields = entity[fieldKey];

    if (!Array.isArray(fields)) {
      throw new Error(
        `Entity '${entity.name}' must have a '${fieldKey}' array.`
      );
    }

    const fieldNames = new Set();

    for (const field of fields) {
      this.#validateField(field, entity.name, allEntityNames, fieldNames);
      fieldNames.add(field.name);
    }

    if (entity.protect) {
      this.#validateEntityProtect(entity.protect, entity.name);
    }
  }

  #validateField(field, entityName, allEntityNames, fieldNames) {
    const { name, type } = field;

    if (!name || typeof name !== "string") {
      throw new Error(`Field in '${entityName}' is missing a valid 'name'.`);
    }

    if (!type || typeof type !== "string") {
      throw new Error(
        `Field '${name}' in '${entityName}' is missing a valid 'type'.`
      );
    }

    if (fieldNames.has(name)) {
      throw new Error(
        `Duplicate field '${name}' found in entity '${entityName}'.`
      );
    }

    if (type === "ref") {
      this.#validateRefField(field, entityName, allEntityNames);
    }

    if ("required" in field && typeof field.required !== "boolean") {
      throw new Error(
        `Field '${field.name}' in '${entityName}' has a 'required' property that must be a boolean.`
      );
    }
  }

  #validateRefField(field, entityName, allEntityNames) {
    if (!field.ref || typeof field.ref !== "string") {
      throw new Error(
        `Field '${field.name}' in '${entityName}' is a 'ref' but missing a valid 'ref' property.`
      );
    }

    if (!allEntityNames.has(field.ref)) {
      throw new Error(
        `Field '${field.name}' in '${entityName}' has 'ref' to unknown entity '${field.ref}'.`
      );
    }

    if (field.ref === entityName) {
      throw new Error(
        `Field '${field.name}' in '${entityName}' cannot reference itself as 'ref'.`
      );
    }
  }

  #validateEntityProtect(protect, entityName) {
    for (const [action, role] of Object.entries(protect)) {
      if (!SUPPORTED_CRUD_ACTIONS.includes(action)) {
        throw new Error(
          `Invalid protect action '${action}' in entity '${entityName}'. Allowed: ${SUPPORTED_CRUD_ACTIONS.join(
            ", "
          )}`
        );
      }

      if (!ALLOWED_PROTECT_ROLES.includes(role)) {
        throw new Error(
          `Invalid role '${role}' for '${action}' in entity '${entityName}'. Allowed: ${ALLOWED_PROTECT_ROLES.join(
            ", "
          )}`
        );
      }
    }
  }
}

export default EntityValidator;
