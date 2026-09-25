import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';

async function runAudit() {
  try {
    await connectDB();
    console.log('[Audit] Connected to MongoDB.');

    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(`[Audit] Total users found: ${users.length}`);

    let anomalyCount = 0;
    for (const u of users) {
      const hasGoalProfile = await db.collection('usergoalprofiles').countDocuments({ userId: u._id });
      const hasRoadmapProgress = await db.collection('userroadmapprogresses').countDocuments({ userId: u._id });
      const taskCount = await db.collection('tasks').countDocuments({ userId: u._id });

      if (hasGoalProfile === 0 && (hasRoadmapProgress > 0 || taskCount > 0)) {
        anomalyCount++;
        console.log(`[Audit Anomaly] User ${u.email} (${u._id}) has NO UserGoalProfile but has ${hasRoadmapProgress} progress docs and ${taskCount} tasks.`);
      }
    }

    console.log(`[Audit] Audit completed. Users with no UserGoalProfile but with tasks/progress: ${anomalyCount}`);
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Audit Error]', err.message);
    process.exit(1);
  }
}

runAudit();
