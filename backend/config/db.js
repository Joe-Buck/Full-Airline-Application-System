const mongoose = require('mongoose');

let memoryServer = null;

async function startMemoryServer() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri();
  await mongoose.connect(memUri);
  console.log('MongoDB connected (in-memory dev server)');
  return { mode: 'memory' };
}

async function connect() {
  mongoose.set('bufferCommands', false);

  const uri = process.env.MONGO_URI;
  const isPlaceholder =
    !uri ||
    uri === 'your_mongodb_atlas_connection_string' ||
    uri.includes('<db_password>') ||
    uri.includes('<password>');

  if (isPlaceholder) {
    console.warn('MONGO_URI is empty or contains a placeholder. Falling back to in-memory MongoDB.');
    return startMemoryServer();
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected (Atlas / external)');
    return { mode: 'external' };
  } catch (err) {
    console.error('============================================================');
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    console.error('Falling back to in-memory MongoDB so the app can still run.');
    console.error('Fix MONGO_URI in Replit Secrets and restart to use Atlas.');
    console.error('============================================================');
    return startMemoryServer();
  }
}

async function disconnect() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

module.exports = { connect, disconnect };
