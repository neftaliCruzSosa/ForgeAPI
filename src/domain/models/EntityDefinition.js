class EntityDefinition {
  constructor(name, fields = []) {
    this.name = name;
    this.fields = fields; // [{ name: 'title', type: 'String' }]
  }
}

export default EntityDefinition;