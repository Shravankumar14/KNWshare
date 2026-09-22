import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Roadmap from '../models/Roadmap.js';
import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import ExpertProfile from '../models/ExpertProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getRoadmapByGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;

    let targetGoal = null;
    let roadmap = null;

    if (mongoose.Types.ObjectId.isValid(goalId)) {
      roadmap = await Roadmap.findOne({ goalId }).populate('goalId');
      if (roadmap) {
        targetGoal = roadmap.goalId;
      } else {
        targetGoal = await Goal.findById(goalId);
      }
    } else {
      targetGoal = await Goal.findOne({ slug: goalId });
      if (targetGoal) {
        roadmap = await Roadmap.findOne({ goalId: targetGoal._id }).populate('goalId');
      }
    }

    // If roadmap is not in DB yet, auto-provision from server/data/goals if available
    if (!roadmap && targetGoal) {
      const dataDir = path.join(__dirname, '../data/goals');
      const goalJsonPath = path.join(dataDir, `${targetGoal.slug}.json`);

      if (fs.existsSync(goalJsonPath)) {
        try {
          const fileData = JSON.parse(fs.readFileSync(goalJsonPath, 'utf8'));
          if (fileData.roadmap) {
            roadmap = await Roadmap.create({
              goalId: targetGoal._id,
              title: fileData.roadmap.title,
              totalEstimatedHours: fileData.roadmap.totalEstimatedHours,
              stages: fileData.roadmap.stages
            });
            roadmap.goalId = targetGoal;
            console.log(`[RoadmapController] Auto-provisioned roadmap for ${targetGoal.title}`);
          }
        } catch (e) {
          console.error('[RoadmapController] Failed to auto-provision roadmap:', e.message);
        }
      }
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found for this goal' });
    }

    let userProgress = {
      completedStages: [],
      completedTopics: [],
    };

    if (req.user) {
      const userGoal = await UserGoal.findOne({ userId: req.user._id, goalId: targetGoal?._id || goalId });
      if (userGoal) {
        userProgress = {
          completedStages: userGoal.completedStages || [],
          completedTopics: userGoal.completedTopics || [],
          overallProgress: userGoal.overallProgress || 0,
        };
      }
    }

    // Fetch matching mentors/experts for this goal
    const goalRefId = targetGoal ? targetGoal._id : goalId;
    let mentors = await ExpertProfile.find({
      targetGoals: goalRefId,
      isAvailable: true
    }).limit(6);

    // Fallback if none specifically tagged
    if (!mentors || mentors.length === 0) {
      mentors = await ExpertProfile.find({ isAvailable: true }).limit(6);
    }

    res.json({
      success: true,
      data: {
        roadmap,
        goal: targetGoal || roadmap.goalId,
        userProgress,
        mentors
      }
    });
  } catch (err) {
    next(err);
  }
};

export const toggleTopicCompletion = async (req, res, next) => {
  try {
    const { goalId, stageNumber, topicTitle } = req.body;
    const userId = req.user._id;

    // Resolve goalId whether objectId or slug
    let resolvedGoalId = goalId;
    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      const g = await Goal.findOne({ slug: goalId });
      if (g) resolvedGoalId = g._id;
    }

    const userGoal = await UserGoal.findOne({ userId, goalId: resolvedGoalId });
    if (!userGoal) {
      return res.status(404).json({ success: false, message: 'Goal enrollment not found' });
    }

    const topicKey = `${stageNumber}:${topicTitle}`;
    const existsIndex = userGoal.completedTopics.indexOf(topicKey);

    if (existsIndex > -1) {
      userGoal.completedTopics.splice(existsIndex, 1);
    } else {
      userGoal.completedTopics.push(topicKey);
    }

    // Check if whole stage is completed
    const roadmap = await Roadmap.findOne({ goalId: resolvedGoalId });
    if (roadmap) {
      const stage = roadmap.stages.find(s => s.stageNumber === stageNumber);

      if (stage) {
        const stageTopics = stage.topics.map(t => `${stageNumber}:${t.title}`);
        const allStageTopicsDone = stageTopics.every(t => userGoal.completedTopics.includes(t));

        if (allStageTopicsDone && !userGoal.completedStages.includes(stageNumber)) {
          userGoal.completedStages.push(stageNumber);
        } else if (!allStageTopicsDone && userGoal.completedStages.includes(stageNumber)) {
          userGoal.completedStages = userGoal.completedStages.filter(s => s !== stageNumber);
        }
      }

      // Compute overall percentage
      const totalStages = roadmap.stages.length;
      if (totalStages > 0) {
        userGoal.overallProgress = Math.round((userGoal.completedStages.length / totalStages) * 100);
      }
    }

    await userGoal.save();

    res.json({
      success: true,
      data: {
        completedTopics: userGoal.completedTopics,
        completedStages: userGoal.completedStages,
        overallProgress: userGoal.overallProgress || 0,
      },
      message: 'Topic status updated'
    });
  } catch (err) {
    next(err);
  }
};
