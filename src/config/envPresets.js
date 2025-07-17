export default {
  common: [
    { key: "PORT", value: "3000", comment: "Puerto en el que se ejecuta la aplicación" },
    { key: "NODE_ENV", value: "development", comment: "Entorno de ejecución: development, production, etc." },
  ],

  auth: {
    jwt: [
      { key: "JWT_SECRET", value: "supersecret", comment: "Clave secreta usada para firmar JWTs" },
      { key: "JWT_EXPIRES_IN", value: "7d", comment: "Tiempo de expiración del JWT (ej: 7d, 1h)" },
    ],
    ironSession: [
      {
        key: "IRON_SESSION_PASSWORD",
        value: "this_is_a_very_secure_password_that_is_32_chars_min",
        comment: "Contraseña secreta usada por Iron Session (mínimo 32 caracteres)",
      },
    ],
  },

  db: {
    mongo: (projectName) => [
      {
        key: "DB_URI",
        value: `mongodb://localhost:27017/${projectName}`,
        comment: "URI de conexión a MongoDB",
      },
    ],
    postgres: (projectName) => [
      { key: "DB_USER", value: "postgres", comment: "Usuario de PostgreSQL" },
      { key: "DB_PASSWORD", value: "postgres", comment: "Contraseña de PostgreSQL" },
      { key: "DB_NAME", value: projectName, comment: "Nombre de la base de datos" },
      { key: "DB_HOST", value: "localhost", comment: "Host donde se encuentra la base de datos" },
      { key: "DB_PORT", value: "5432", comment: "Puerto de conexión a la base de datos" },
    ],
  },
};
