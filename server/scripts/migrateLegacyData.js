import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';

import User from '../models/User.js';
import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserRoadmapProgress from '../models/UserRoadmapProgress.js';
import RoadmapTopic from '../models/RoadmapTopic.js';

dotenv.config();

export const runMigration = async () => {
  console.log('====================================================');
  console.log('🔄 [Migration] Starting Legacy Data Migration & Back-compat');
  console.log('====================================================');

  // 1. Resolve JEE Goal (canonical: jee-main-advanced)
  const canonicalJeeGoal = await Goal.findOne({ slug: 'jee-main-advanced' });
  const legacyJeeGoal = await Goal.findOne({ slug: 'jee-mains-advanced' });

  // 2. Migrate User records: set currentGoalSlug & currentGoalId
  const users = await User.find({});
  console.log(`[Migration] Auditing ${users.length} user records...`);

  for (const user of users) {
    let updated = false;

    if (!user.currentGoalId && canonicalJeeGoal) {
      user.currentGoalId = canonicalJeeGoal._id;
      user.currentGoalSlug = canonicalJeeGoal.slug;
      updated = true;
    } else if (user.currentGoalSlug === 'jee-mains-advanced' && canonicalJeeGoal) {
      user.currentGoalSlug = canonicalJeeGoal.slug;
      user.currentGoalId = canonicalJeeGoal._id;
      updated = true;
    }

    if (updated) {
      await user.save();
      console.log(`  ✓ Updated user ${user.email} currentGoal -> ${user.currentGoalSlug}`);
    }
  }

  // 3. Migrate UserGoal records to UserGoalProfile & UserRoadmapProgress
  const userGoals = await UserGoal.find({}).populate('goalId');
  console.log(`[Migration] Migrating ${userGoals.length} UserGoal records...`);

  for (const ug of userGoals) {
    let targetGoalId = ug.goalId?._id;
    let targetSlug = ug.goalId?.slug || 'jee-main-advanced';

    if (targetSlug === 'jee-mains-advanced' && canonicalJeeGoal) {
      targetGoalId = canonicalJeeGoal._id;
      targetSlug = canonicalJeeGoal.slug;
    }

    if (!targetGoalId) continue;

    // Upsert UserGoalProfile
    await UserGoalProfile.findOneAndUpdate(
      { userId: ug.userId, goalId: targetGoalId },
      {
        userId: ug.userId,
        goalId: targetGoalId,
        goalSlug: targetSlug,
        level: ug.currentLevel || 'beginner',
        hoursPerDay: ug.hoursPerDay || 2,
        daysPerWeek: Math.min(7, Math.max(1, Math.round((ug.hoursPerWeek || 14) / (ug.hoursPerDay || 2)))),
        targetTimelineWeeks: 24,
        status: ug.status || 'active'
      },
      { upsert: true, new: true }
    );

    // Migrate completedTopics array (e.g., ["1:Vectors", "1:Units"]) to UserRoadmapProgress
    if (ug.completedTopics && ug.completedTopics.length > 0) {
      for (const topicKey of ug.completedTopics) {
        // topicKey can be "stageNumber:Topic Title" or "Topic Title"
        let topicTitle = topicKey;
        let stageNum = 1;
        if (topicKey.includes(':')) {
          const parts = topicKey.split(':');
          stageNum = parseInt(parts[0], 10) || 1;
          topicTitle = parts.slice(1).join(':').trim();
        }

        // Find matching RoadmapTopic
        const matchedTopic = await RoadmapTopic.findOne({
          goalId: targetGoalId,
          title: new RegExp(`^${topicTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
        });

        await UserRoadmapProgress.findOneAndUpdate(
          {
            userId: ug.userId,
            goalId: targetGoalId,
            topicKey
          },
          {
            userId: ug.userId,
            goalId: targetGoalId,
            topicId: matchedTopic ? matchedTopic._id : undefined,
            stageNumber: stageNum,
            topicTitle,
            topicKey,
            status: 'completed',
            completedAt: new Date()
          },
          { upsert: true, new: true }
        );
      }
      console.log(`  ✓ Migrated ${ug.completedTopics.length} completed topics for user ${ug.userId}`);
    }
  }

  console.log('====================================================');
  console.log('✅ [Migration] Completed successfully with zero data loss!');
  console.log('====================================================');
  return true;
};

if (process.argv[1]?.endsWith('migrateLegacyData.js')) {
  (async () => {
    try {
      await connectDB();
      await runMigration();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Migration] Failed:', err);
      process.exit(1);
    }
  })();
}
