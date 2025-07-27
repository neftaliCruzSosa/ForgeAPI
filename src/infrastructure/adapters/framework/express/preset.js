export default {
  label: "Express",
  deps: {
    express: "^4.18.2",
    cors: "^2.8.5",
    morgan: "^1.10.0",
    helmet: "^7.0.0",
    joi: "^17.13.3",
  },
  env: [
    { key: "PORT", value: "3000", comment: "Puerto en que corre la app" },
    { key: "NODE_ENV", value: "development", comment: "Modo de ejecución" },
  ],
  structure: {
    auth: "auth",
    models: "models",
    controllers: "controllers",
    routes: "routes",
    middlewares: "middlewares",
    validators: "validators",
    services: "services",
  },
  middlewares: ["errorHandler.ejs"],
};
