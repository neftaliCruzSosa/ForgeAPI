export default {
  label: "Json Web Tokens (JWT)",
  deps: {
    jsonwebtoken: "^9.0.2",
    bcrypt: "^5.1.1",
  },
  env: [
    {
      key: "JWT_SECRET",
      value: "supersecret",
      comment: "Clave secreta usada para firmar JWTs",
    },
    { key: "JWT_EXPIRES_IN", value: "7d", comment: "Duración del JWT" },
  ],
  routes: [
    { method: "POST", path: "/auth/register", description: "register" },
    { method: "POST", path: "/auth/login", description: "login" },
    {
      method: "PUT",
      path: "/auth/promote/:username",
      description: "promote to admin [admin]",
    },
  ],
};
