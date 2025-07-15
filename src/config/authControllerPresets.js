export default {
  mongo: {
    findByUsername: "await User.findOne({ username });",
  },
  postgres: {
    findByUsername: "await User.findOne({ where: { username } });",
  },
};
