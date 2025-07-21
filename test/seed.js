
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Like = require('./models/Like');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({})
  ]);

  const users = await User.insertMany([
    { username: 'admin', password: 'admin123', role: 'admin', bio: 'Administrador', avatar: '' },
    { username: 'alice', password: 'alice123', role: 'user', bio: 'Soy Alice', avatar: '' },
    { username: 'bob', password: 'bob123', role: 'user', bio: 'Soy Bob', avatar: '' }
  ]);

  const posts = await Post.insertMany([
    { title: 'Primer Post', content: 'Contenido de prueba', author: users[1]._id, tags: ['bienvenida'] },
    { title: 'Segundo Post', content: 'Otro contenido', author: users[2]._id, tags: ['test'] }
  ]);

  const comments = await Comment.insertMany([
    { text: 'Buen post!', post: posts[0]._id, author: users[2]._id },
    { text: 'Gracias!', post: posts[0]._id, author: users[1]._id }
  ]);

  await Like.insertMany([
    { post: posts[0]._id, user: users[1]._id },
    { post: posts[0]._id, user: users[2]._id }
  ]);

  console.log('Seed completado');
  mongoose.disconnect();
}

seed();
