import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Like from "./models/Like.js";

async function seed() {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
  ]);

  const users = await User.insertMany([
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
      role: "user",
      bio: "Soy Alice",
      avatar: "",
    },
    {
      username: "bob",
      password: await bcrypt.hash("bob123", 10),
      role: "user",
      bio: "Soy Bob",
      avatar: "",
    },
  ]);

  const posts = await Post.insertMany([
    {
      title: "Primer Post",
      content: "Contenido de prueba",
      createdBy: users[1]._id,
      tags: ["bienvenida"],
    },
    {
      title: "Segundo Post",
      content: "Otro contenido",
      createdBy: users[2]._id,
      tags: ["test"],
    },
  ]);

  const comments = await Comment.insertMany([
    { text: "Buen post!", post: posts[0]._id, createdBy: users[2]._id },
    { text: "Gracias!", post: posts[0]._id, createdBy: users[1]._id },
  ]);

  await Like.insertMany([
    { post: posts[0]._id, createdBy: users[1]._id },
    { post: posts[0]._id, createdBy: users[2]._id },
  ]);

  console.log("Seed completado");
  mongoose.disconnect();
}

seed();
