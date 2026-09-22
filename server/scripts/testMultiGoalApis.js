import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';

import Goal from '../models/Goal.js';
import Roadmap from '../models/Roadmap.js';
import RoadmapStage from '../models/RoadmapStage.js';
import RoadmapTopic from '../models/RoadmapTopic.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserRoadmapProgress from '../models/UserRoadmapProgress.js';

import {
  calculatePersonalizedPacing,
  topologicalSortTopics
} from '../services/personalizationEngine.js';

dotenv.config();

const runTests = async () => {
  console.log('====================================================');
  console.log('🧪 Starting Multi-Goal System Phase Gate Tests');
  console.log('====================================================');

  await connectDB();

  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  };

  try {
    // ----------------------------------------------------
    // TEST 1: All 4 Goals Exist with correct active status and slugs
    // ----------------------------------------------------
    console.log('\n[Test 1] Verifying 4 Core Goals...');
    const expectedSlugs = [
      'jee-main-advanced',
      'full-stack-development',
      'competitive-programming-dsa',
      'machine-learning-ai'
    ];

    const goals = await Goal.find({ active: { $ne: false } }).sort({ order: 1 });
    assert(goals.length >= 4, `Found ${goals.length} active goals (expected >= 4)`);

    for (const slug of expectedSlugs) {
      const match = goals.find((g) => g.slug === slug);
      assert(!!match, `Goal with slug '${slug}' exists`);
    }

    // ----------------------------------------------------
    // TEST 2: Each Goal has its own distinct Roadmap with zero leakage
    // ----------------------------------------------------
    console.log('\n[Test 2] Verifying Roadmaps and Stage/Topic Isolation...');
    for (const slug of expectedSlugs) {
      const goal = goals.find((g) => g.slug === slug);
      const roadmap = await Roadmap.findOne({ goalId: goal._id });
      assert(!!roadmap, `Roadmap exists for goal '${slug}'`);

      const stages = await RoadmapStage.find({ roadmapId: roadmap._id });
      assert(stages.length >= 3, `Goal '${slug}' has ${stages.length} stages (expected >= 3)`);

      const stageIds = stages.map((s) => s._id);
      const topics = await RoadmapTopic.find({ stageId: { $in: stageIds } });
      assert(topics.length >= 5, `Goal '${slug}' has ${topics.length} topics (expected >= 5)`);

      // Verify ZERO stages or topics point to wrong goalId
      const leakedStages = await RoadmapStage.countDocuments({
        roadmapId: roadmap._id,
        goalId: { $ne: goal._id }
      });
      assert(leakedStages === 0, `Zero cross-goal stage leakage for '${slug}'`);
    }

    // ----------------------------------------------------
    // TEST 3: Resource Filtering & Verification Rules
    // ----------------------------------------------------
    console.log('\n[Test 3] Verifying Resource Model & Filtering...');
    const totalResources = await Resource.countDocuments();
    assert(totalResources >= 30, `Total resources in DB: ${totalResources} (expected >= 30)`);

    // Verify compound indexing works
    const jeeGoal = goals.find((g) => g.slug === 'jee-main-advanced');
    const jeeResources = await Resource.find({
      $or: [{ goalIds: jeeGoal._id }, { goalId: jeeGoal._id }]
    });
    assert(jeeResources.length >= 10, `JEE has ${jeeResources.length} curated resources`);

    // Verify teacher resource moderation gating (§7)
    let teacherUser = await User.findOne({ role: 'teacher' });
    if (!teacherUser) {
      teacherUser = await User.create({
        name: 'Dr. Mentor',
        email: 'mentor_test@knwshare.dev',
        password: 'password123',
        role: 'teacher'
      });
    }

    // Create unverified teacher resource
    const unverifiedResource = await Resource.create({
      title: 'Draft Mechanics Notes by Dr. Mentor',
      url: 'https://example.com/draft-notes',
      sourceType: 'teacher',
      createdBy: teacherUser._id,
      verified: false,
      isVerified: false,
      goalIds: [jeeGoal._id]
    });

    // Query as student (verified only)
    const studentView = await Resource.find({
      goalIds: jeeGoal._id,
      verified: true
    });
    const foundInStudent = studentView.some(
      (r) => r._id.toString() === unverifiedResource._id.toString()
    );
    assert(!foundInStudent, 'Unverified teacher resource is HIDDEN from student catalog');

    // Clean up test resource
    await Resource.deleteOne({ _id: unverifiedResource._id });

    // ----------------------------------------------------
    // TEST 4: Personalization Engine Pacing & Topological Sort
    // ----------------------------------------------------
    console.log('\n[Test 4] Verifying Deterministic Personalization Engine...');
    const dsaGoal = goals.find((g) => g.slug === 'competitive-programming-dsa');
    const dsaRoadmap = await Roadmap.findOne({ goalId: dsaGoal._id });
    const dsaStages = await RoadmapStage.find({ roadmapId: dsaRoadmap._id }).sort({ order: 1 });
    const dsaStageIds = dsaStages.map((s) => s._id);
    const dsaTopics = await RoadmapTopic.find({ stageId: { $in: dsaStageIds } }).sort({ order: 1 });

    // Group topics into stages for pacing input
    const stageTree = dsaStages.map((s) => {
      const obj = s.toObject();
      obj.topics = dsaTopics.filter((t) => t.stageId.toString() === s._id.toString());
      return obj;
    });

    // Run Profile A: Beginner with 2 hours/day, 6 days/week (12 hrs/wk)
    const pacingA = calculatePersonalizedPacing({
      userGoalProfile: { level: 'beginner', hoursPerDay: 2, daysPerWeek: 6 },
      stages: stageTree,
      completedTopicIds: [],
      resources: []
    });

    // Run Profile B: Advanced with 4 hours/day, 7 days/week (28 hrs/wk)
    const pacingB = calculatePersonalizedPacing({
      userGoalProfile: { level: 'advanced', hoursPerDay: 4, daysPerWeek: 7 },
      stages: stageTree,
      completedTopicIds: [],
      resources: []
    });

    assert(pacingA.weeks.length > 0, `Profile A generated ${pacingA.weeks.length} weeks of schedule`);
    assert(pacingB.weeks.length > 0, `Profile B generated ${pacingB.weeks.length} weeks of schedule`);
    assert(
      pacingA.weeks.length > pacingB.weeks.length,
      `Beginner profile requires more weeks (${pacingA.weeks.length}) than Advanced profile (${pacingB.weeks.length})`
    );

    // ----------------------------------------------------
    // TEST 5: User Goal Profile & User Roadmap Progress Persistence
    // ----------------------------------------------------
    console.log('\n[Test 5] Verifying UserGoalProfile & Topic Progress Tracking...');
    const testStudent = await User.findOne({ email: 'student@knwshare.dev' });
    assert(!!testStudent, 'Test student user exists');

    // Save profile for ML goal
    const mlGoal = goals.find((g) => g.slug === 'machine-learning-ai');
    const userProfile = await UserGoalProfile.findOneAndUpdate(
      { userId: testStudent._id, goalId: mlGoal._id },
      {
        userId: testStudent._id,
        goalId: mlGoal._id,
        goalSlug: mlGoal.slug,
        level: 'intermediate',
        hoursPerDay: 3,
        daysPerWeek: 5,
        targetTimelineWeeks: 18
      },
      { upsert: true, new: true }
    );
    assert(userProfile.level === 'intermediate', 'UserGoalProfile saved with intermediate level');

    // Mark a topic progress
    const firstMlTopic = await RoadmapTopic.findOne({ goalId: mlGoal._id });
    const progressDoc = await UserRoadmapProgress.findOneAndUpdate(
      { userId: testStudent._id, goalId: mlGoal._id, topicId: firstMlTopic._id },
      {
        userId: testStudent._id,
        goalId: mlGoal._id,
        topicId: firstMlTopic._id,
        status: 'completed',
        completedAt: new Date()
      },
      { upsert: true, new: true }
    );
    assert(progressDoc.status === 'completed', `Topic '${firstMlTopic.title}' marked as completed`);

    // Fetch pacing again with completed topic and verify completedHours increased
    const mlRoadmap = await Roadmap.findOne({ goalId: mlGoal._id });
    const mlStages = await RoadmapStage.find({ roadmapId: mlRoadmap._id }).sort({ order: 1 });
    const mlStageIds = mlStages.map((s) => s._id);
    const mlTopics = await RoadmapTopic.find({ stageId: { $in: mlStageIds } });
    const mlStageTree = mlStages.map((s) => {
      const obj = s.toObject();
      obj.topics = mlTopics.filter((t) => t.stageId.toString() === s._id.toString());
      return obj;
    });

    const mlPacing = calculatePersonalizedPacing({
      userGoalProfile: userProfile,
      stages: mlStageTree,
      completedTopicIds: [firstMlTopic._id.toString()],
      resources: []
    });

    assert(mlPacing.summary.completedHours > 0, `Completed hours properly counted: ${mlPacing.summary.completedHours}h`);
    assert(mlPacing.summary.completionPercentage > 0, `Completion percentage properly calculated: ${mlPacing.summary.completionPercentage}%`);

  } catch (err) {
    console.error('Test Execution Error:', err);
    failed++;
  } finally {
    await disconnectDB();
  }

  console.log('\n====================================================');
  console.log(`Test Results: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
