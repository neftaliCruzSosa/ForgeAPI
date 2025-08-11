export default {
  label: "MongoDB",
  deps: {
    mongoose: "^7.6.1"
  },
  env: (projectName: string) => [
    { key: "DB_URI", value: `mongodb://localhost:27017/${projectName}`, comment: "MongoDB URI" }
  ],
  controller: {
    findByUsername: "await User.findOne({ username });"
  }
};
