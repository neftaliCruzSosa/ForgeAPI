export default {
  common: ["PORT=3000", "NODE_ENV=development"],

  auth: {
    jwt: ["JWT_SECRET=supersecret", "JWT_EXPIRES_IN=7d"],
    ironSession: [
      "IRON_SESSION_PASSWORD=this_is_a_very_secure_password_that_is_32_chars_min",
    ],
  },

  db: {
    mongo: (projectName) => [`DB_URI=mongodb://localhost:27017/${projectName}`],
    postgres: (projectName) => [
      "DB_USER=postgres",
      "DB_PASSWORD=postgres",
      `DB_NAME=${projectName}`,
      "DB_HOST=localhost",
      "DB_PORT=5432",
    ],
  },
};
