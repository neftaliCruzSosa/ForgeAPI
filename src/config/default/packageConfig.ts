export const DEFAULT_DEPENDENCIES: Record<string, string> = {
  dotenv: "^16.3.1",
};

export const DEFAULT_DEV_DEPENDENCIES: Record<string, string> = {
  nodemon: "^2.0.22",
};

export const DEFAULT_SCRIPTS: Record<string, string> = {
  start: "node app.js",
  dev: "nodemon app.js",
};
