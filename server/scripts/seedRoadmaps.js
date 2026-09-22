import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';

import Goal from '../models/Goal.js';
import Roadmap from '../models/Roadmap.js';
import RoadmapStage from '../models/RoadmapStage.js';
import RoadmapTopic from '../models/RoadmapTopic.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import UserGoal from '../models/UserGoal.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserRoadmapProgress from '../models/UserRoadmapProgress.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const roadmapsDir = path.join(__dirname, '../data/roadmaps');

export const seedRoadmaps = async () => {
  console.log('====================================================');
  console.log('🌱 [SeedRoadmaps] Starting Idempotent Multi-Goal Seed');
  console.log('====================================================');

  const goalFiles = [
    'jee-main-advanced.json',
    'full-stack-development.json',
    'competitive-programming-dsa.json',
    'machine-learning-ai.json'
  ];

  const seededGoals = [];

  for (const filename of goalFiles) {
    const filePath = path.join(roadmapsDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Seed] Warning: File not found: ${filePath}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const { goal: goalData, roadmap: roadmapData, resources: resourcesData = [] } = data;

    console.log(`[Seed] Processing Goal: ${goalData.title} (${goalData.slug})...`);

    // 1. Upsert Goal
    let goal = await Goal.findOne({ slug: goalData.slug });
    if (!goal) {
      goal = await Goal.create({
        ...goalData,
        active: true
      });
      console.log(`  ✓ Created Goal: ${goal.title} [${goal._id}]`);
    } else {
      goal.set({
        ...goalData,
        active: true
      });
      await goal.save();
      console.log(`  ✓ Updated Goal: ${goal.title} [${goal._id}]`);
    }

    seededGoals.push(goal);

    // 2. Upsert Roadmap
    let roadmap = await Roadmap.findOne({ goalId: goal._id });
    if (!roadmap) {
      roadmap = await Roadmap.create({
        goalId: goal._id,
        slug: goal.slug,
        title: roadmapData.title,
        version: roadmapData.version || 1,
        totalEstimatedHours: roadmapData.totalEstimatedHours || 200,
        stages: roadmapData.stages || [], // preserve embedded representation for fast queries
        active: true
      });
      console.log(`  ✓ Created Roadmap: ${roadmap.title} [${roadmap._id}]`);
    } else {
      roadmap.set({
        title: roadmapData.title,
        totalEstimatedHours: roadmapData.totalEstimatedHours || roadmap.totalEstimatedHours,
        stages: roadmapData.stages || [],
        active: true
      });
      await roadmap.save();
      console.log(`  ✓ Updated Roadmap: ${roadmap.title} [${roadmap._id}]`);
    }

    // 3. Upsert Standalone Stages and Topics
    const stageIds = [];
    const stageMapByNumber = new Map();
    const topicMapByKey = new Map();

    for (let sIdx = 0; sIdx < (roadmapData.stages || []).length; sIdx++) {
      const stg = roadmapData.stages[sIdx];
      const stageNumber = stg.stageNumber || (sIdx + 1);

      let stageDoc = await RoadmapStage.findOne({
        roadmapId: roadmap._id,
        stageNumber
      });

      const stagePayload = {
        roadmapId: roadmap._id,
        goalId: goal._id,
        stageNumber,
        title: stg.title,
        description: stg.description || stg.shortSummary || '',
        subject: stg.subject || '',
        order: sIdx + 1,
        estimatedHours: stg.estimatedHours || 20,
        difficulty: stg.difficulty || 'beginner',
        learningObjectives: stg.learningObjectives || [],
        practiceRequirements: stg.practiceRequirements || [],
        skippableIfExperienced: !!stg.skippableIfExperienced
      };

      if (!stageDoc) {
        stageDoc = await RoadmapStage.create(stagePayload);
      } else {
        stageDoc.set(stagePayload);
        await stageDoc.save();
      }

      stageIds.push(stageDoc._id);
      stageMapByNumber.set(stageNumber, stageDoc._id);

      // Topics for this stage
      for (let tIdx = 0; tIdx < (stg.topics || []).length; tIdx++) {
        const top = stg.topics[tIdx];
        const topicOrder = top.order || (tIdx + 1);

        let topicDoc = await RoadmapTopic.findOne({
          stageId: stageDoc._id,
          title: top.title
        });

        const topicPayload = {
          stageId: stageDoc._id,
          roadmapId: roadmap._id,
          goalId: goal._id,
          title: top.title,
          description: top.description || '',
          order: topicOrder,
          estimatedHours: top.estimatedHours || 5,
          difficulty: top.difficulty || 'beginner',
          skills: top.skills || [],
          subtopics: top.subtopics || [],
          subject: top.subject || stg.subject || ''
        };

        if (!topicDoc) {
          topicDoc = await RoadmapTopic.create(topicPayload);
        } else {
          topicDoc.set(topicPayload);
          await topicDoc.save();
        }

        topicMapByKey.set(`${stageNumber}:${top.title}`, topicDoc._id);
        topicMapByKey.set(top.title, topicDoc._id);
      }
    }

    // Attach stageIds back to roadmap
    roadmap.stageIds = stageIds;
    await roadmap.save();
    console.log(`  ✓ Synced ${stageIds.length} stages and associated topics.`);

    // 4. Upsert Curated Resources
    let resourcesUpserted = 0;
    for (const res of resourcesData) {
      const matchedStageId = res.stageNumber ? stageMapByNumber.get(res.stageNumber) : null;
      const matchedTopicId = res.topicTitle ? topicMapByKey.get(res.topicTitle) : null;

      const filter = {
        title: res.title,
        url: res.url
      };

      const update = {
        title: res.title,
        provider: res.provider || '',
        url: res.url,
        description: res.description || '',
        type: res.type || 'documentation',
        free: res.free !== undefined ? res.free : true,
        isFree: res.free !== undefined ? res.free : true,
        language: res.language || 'English',
        sourceType: 'external',
        verified: true,
        isVerified: true,
        goalId: goal._id,
        goalIds: [goal._id],
        stageNumber: res.stageNumber || 1,
        topicTitle: res.topicTitle || '',
        stageIds: matchedStageId ? [matchedStageId] : [],
        topicIds: matchedTopicId ? [matchedTopicId] : []
      };

      await Resource.findOneAndUpdate(filter, update, { upsert: true, new: true });
      resourcesUpserted++;
    }
    console.log(`  ✓ Upserted ${resourcesUpserted} curated resources for ${goal.title}.`);
  }

  // 5. DEMO USER & BACKWARD COMPATIBILITY
  console.log('[Seed] Ensuring Demo Student & Goal Profiles exist...');
  let demoUser = await User.findOne({ email: 'student@knwshare.dev' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@knwshare.dev',
      password: 'password123',
      role: 'student',
      bio: 'Lifelong learner actively mastering Multi-Goal roadmaps.'
    });
    console.log('  ✓ Demo Student user created');
  }

  const primaryGoal = seededGoals[0]; // JEE Main & Advanced
  demoUser.currentGoalId = primaryGoal._id;
  demoUser.currentGoalSlug = primaryGoal.slug;
  await demoUser.save();

  // Create UserGoalProfile for primary goal
  await UserGoalProfile.findOneAndUpdate(
    { userId: demoUser._id, goalId: primaryGoal._id },
    {
      userId: demoUser._id,
      goalId: primaryGoal._id,
      goalSlug: primaryGoal.slug,
      level: 'beginner',
      hoursPerDay: 3,
      daysPerWeek: 6,
      targetTimelineWeeks: 24,
      status: 'active'
    },
    { upsert: true, new: true }
  );

  // Also create UserGoalProfile for Full Stack
  const fsGoal = seededGoals.find(g => g.slug === 'full-stack-development');
  if (fsGoal) {
    await UserGoalProfile.findOneAndUpdate(
      { userId: demoUser._id, goalId: fsGoal._id },
      {
        userId: demoUser._id,
        goalId: fsGoal._id,
        goalSlug: fsGoal.slug,
        level: 'intermediate',
        hoursPerDay: 2,
        daysPerWeek: 5,
        targetTimelineWeeks: 16,
        status: 'active'
      },
      { upsert: true, new: true }
    );
  }

  console.log('====================================================');
  console.log('✅ [SeedRoadmaps] Multi-Goal Seed Completed Successfully!');
  console.log('====================================================');
  return true;
};

// If run directly: node seedRoadmaps.js
if (process.argv[1]?.endsWith('seedRoadmaps.js')) {
  (async () => {
    try {
      await connectDB();
      await seedRoadmaps();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[SeedRoadmaps] Critical failure:', err);
      process.exit(1);
    }
  })();
}
