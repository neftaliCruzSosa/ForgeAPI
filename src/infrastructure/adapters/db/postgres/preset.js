export default {
  label: "PostgreSQL",
  deps: {
    sequelize: "^6.35.1",
    pg: "^8.11.3",
  },
  env: (projectName) => [
    { key: "DB_USER", value: "postgres", comment: "Usuario de PostgreSQL" },
    {
      key: "DB_PASSWORD",
      value: "postgres",
      comment: "Contraseña de PostgreSQL",
    },
    {
      key: "DB_NAME",
      value: projectName.replace(/-/g, "_"),
      comment: "Nombre de la base de datos",
    },
    {
      key: "DB_HOST",
      value: "localhost",
      comment: "Host donde se encuentra la base de datos",
    },
    {
      key: "DB_PORT",
      value: "5432",
      comment: "Puerto de conexión a la base de datos",
    },
  ],
  controller: {
    findByUsername: "await User.findOne({ where: { username } });",
  },
};
