export const DEFAULT_DEPENDENCIES = {
  express: "^4.18.2",
  dotenv: "^16.3.1",
  helmet: "^7.0.0",
  cors: "^2.8.5",
  morgan: "^1.10.0",
  joi: "^17.9.2",
};

export const DEFAULT_DEV_DEPENDENCIES = {
  nodemon: "^2.0.22",
};

export const DEFAULT_SCRIPTS = {
  start: "node app.js",
  dev: "nodemon app.js",
};
