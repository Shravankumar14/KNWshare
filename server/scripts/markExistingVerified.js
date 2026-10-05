import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

async function markExistingVerified() {
  try {
    await connectDB();
    console.log('[Migration] Connected to MongoDB.');

    const result = await User.updateMany(
      { isEmailVerified: { $ne: true } },
      { $set: { isEmailVerified: true } }
    );

    console.log(`[Migration] Updated ${result.modifiedCount} user(s) to isEmailVerified=true.`);
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]', err.message);
    process.exit(1);
  }
}

markExistingVerified();
