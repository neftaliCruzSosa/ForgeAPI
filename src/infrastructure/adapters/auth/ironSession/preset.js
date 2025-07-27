export default {
  label: "IronSession",
  deps: {
    "iron-session": "^8.0.0",
    bcrypt: "^5.1.1",
  },
  env: [
    {
      key: "IRON_SESSION_PASSWORD",
      value: "this_is_a_very_secure_password_that_is_32_chars_min",
      comment:
        "Contraseña secreta usada por Iron Session (mínimo 32 caracteres)",
    },
  ],
  routes: [
    { method: "POST", path: "/auth/register", description: "register" },
    { method: "POST", path: "/auth/login", description: "login" },
    { method: "POST", path: "/auth/logout", description: "logout" },
    {
      method: "GET",
      path: "/auth/profile",
      description: "get session user [auth]",
    },
    {
      method: "PUT",
      path: "/auth/promote/:username",
      description: "promote to admin [admin]",
    },
  ],
};
