import "dotenv/config";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Like from "./models/Like.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  }
);

async function seed() {
  try {
    User.initModel(sequelize);
    Post.initModel(sequelize);
    Comment.initModel(sequelize);
    Like.initModel(sequelize);

    User.associate(sequelize.models);
    Post.associate(sequelize.models);
    Comment.associate(sequelize.models);
    Like.associate(sequelize.models);

    await sequelize.sync({ force: true });

    const users = await sequelize.models.User.bulkCreate([
      {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        bio: "Administrador",
        avatar: "",
      },
      {
        username: "alice",
        password: await bcrypt.hash("alice123", 10),
        password: "alice123",
        role: "user",
        bio: "Soy Alice",
        avatar: "",
      },
      {
        username: "bob",
        password: await bcrypt.hash("bob123", 10),
        password: "bob123",
        role: "user",
        bio: "Soy Bob",
        avatar: "",
      },
    ]);

    const posts = await sequelize.models.Post.bulkCreate([
      {
        title: "Primer Post",
        content: "Contenido de prueba",
        createdBy: users[1].id,
        tags: ["bienvenida"],
      },
      {
        title: "Segundo Post",
        content: "Otro contenido",
        createdBy: users[2].id,
        tags: ["test"],
      },
    ]);

    await sequelize.models.Comment.bulkCreate([
      { text: "Buen post!", post: posts[0].id, createdBy: users[2].id },
      { text: "Gracias!", post: posts[0].id, createdBy: users[1].id },
    ]);

    await sequelize.models.Like.bulkCreate([
      { post: posts[0].id, createdBy: users[1].id },
      { post: posts[0].id, createdBy: users[2].id },
    ]);

    console.log("Seed completado con PostgreSQL");
  } catch (error) {
    console.error("Error ejecutando el seed:", error);
  } finally {
    await sequelize.close();
  }
}

seed();
