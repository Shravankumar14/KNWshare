import mongoose from 'mongoose';
import dns from 'dns';

// Fix: Node.js system DNS can't resolve MongoDB Atlas SRV records on some networks.
// Force Google DNS (8.8.8.8) so that mongodb+srv:// connection strings always work.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log('[Database] Connecting to MongoDB...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log('[Database] Successfully connected to MongoDB.');
      return;
    }
  } catch (err) {
    console.warn('[Database] Failed to connect to specified MongoDB database. Falling back to embedded in-memory MongoDB...', err.message);
  }

  // Graceful fallback to in-memory MongoDB for local dev without external daemon
  try {
    console.log('[Database] Initializing embedded MongoDB Memory Server for zero-friction development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 }
    });
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('[Database] Connected to embedded MongoDB Memory Server.');
  } catch (memErr) {
    console.error('[Database] Critical error connecting to in-memory database:', memErr);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[Database] Disconnected from MongoDB.');
  } catch (err) {
    console.error('[Database] Disconnect error:', err);
  }
};
