export default {
  mongo: {
    label: "MongoDB",
    env: (projectName) => [
      `DB_URI=mongodb://localhost:27017/${projectName}`
    ],
    deps: {
      mongoose: "^7.6.1"
    }
  },

  postgres: {
    label: "PostgreSQL",
    env: (projectName) => [
      "DB_USER=postgres",
      "DB_PASSWORD=postgres",
      `DB_NAME=${projectName.replace(/-/g, "_")}`,
      "DB_HOST=localhost",
      "DB_PORT=5432"
    ],
    deps: {
      sequelize: "^6.35.1",
      pg: "^8.11.3"
    }
  }
};
