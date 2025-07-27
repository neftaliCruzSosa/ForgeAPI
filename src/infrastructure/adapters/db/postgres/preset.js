export default {
  label: "PostgreSQL",
  deps: {
    sequelize: "^6.35.1",
    pg: "^8.11.3",
  },
  env: (projectName) => [
    { key: "DB_USER", value: "postgres", comment: "PostgreSQL user" },
    {
      key: "DB_PASSWORD",
      value: "postgres",
      comment: "PostgreSQL password",
    },
    {
      key: "DB_NAME",
      value: projectName.replace(/-/g, "_"),
      comment: "Database name",
    },
    {
      key: "DB_HOST",
      value: "localhost",
      comment: "Database host",
    },
    {
      key: "DB_PORT",
      value: "5432",
      comment: "Database connection port",
    },
  ],
  controller: {
    findByUsername: "await User.findOne({ where: { username } });",
  },
};
