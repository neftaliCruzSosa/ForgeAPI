export default {
  dbType: "mongo",
  authType: "jwt",
  auth: false,
  framework: "express",
  force: false,
  author: "unknown",
  outputDir: (projectName) => `./projects/${projectName}`,
  templateDir: `./src/templates`
};
