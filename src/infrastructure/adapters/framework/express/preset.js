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
    { key: "PORT", value: "3000", comment: "Port where the app runs" },
    { key: "NODE_ENV", value: "development", comment: "Execution mode" },
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
