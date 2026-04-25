const mongoose = require('mongoose');

let memoryServer = null;

async function connect() {
  mongoose.set('bufferCommands', false);

  const uri = process.env.MONGO_URI;
  const isPlaceholder = !uri || uri === 'your_mongodb_atlas_connection_string';

  if (!isPlaceholder) {
    await mongoose.connect(uri);
    console.log('MongoDB connected (Atlas / external)');
    return { mode: 'external' };
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri();
  await mongoose.connect(memUri);
  console.log('MongoDB connected (in-memory dev server)');
  console.warn('Set MONGO_URI in backend/.env to use a persistent MongoDB Atlas database.');
  return { mode: 'memory' };
}

async function disconnect() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

module.exports = { connect, disconnect };
