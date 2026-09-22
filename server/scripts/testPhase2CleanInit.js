import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserRoadmapProgress from '../models/UserRoadmapProgress.js';
import Task from '../models/Task.js';
import UserGoal from '../models/UserGoal.js';
import Goal from '../models/Goal.js';

async function testCleanInit() {
  console.log('[Test Phase 2] Testing clean user registration and goal integrity...');
  try {
    await connectDB();

    // 1. Create a fresh student user
    const testEmail = `freshstudent_${Date.now()}@knwshare.dev`;
    const freshUser = await User.create({
      name: 'Fresh Student',
      email: testEmail,
      password: 'password123',
      role: 'student'
    });

    console.log(`[Test Phase 2] Created fresh student: ${freshUser.email} (${freshUser._id})`);

    // 2. Verify NO goal profiles, progress, or tasks were auto-created
    const goalProfiles = await UserGoalProfile.countDocuments({ userId: freshUser._id });
    const progressDocs = await UserRoadmapProgress.countDocuments({ userId: freshUser._id });
    const userGoals = await UserGoal.countDocuments({ userId: freshUser._id });
    const tasks = await Task.countDocuments({ userId: freshUser._id });

    console.log(`[Test Phase 2] Verification counts for new user:`, {
      goalProfiles,
      progressDocs,
      userGoals,
      tasks
    });

    if (goalProfiles !== 0 || progressDocs !== 0 || userGoals !== 0 || tasks !== 0) {
      throw new Error(`Integrity Failure! New user has non-zero records: ${JSON.stringify({ goalProfiles, progressDocs, userGoals, tasks })}`);
    }

    console.log('✅ Gate Test 2 Passed: Fresh registration results in zero goal profiles, progress, or tasks in DB.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gate Test 2 Failed:', err.message);
    await disconnectDB();
    process.exit(1);
  }
}

testCleanInit();
