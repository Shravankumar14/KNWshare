import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Resource from '../models/Resource.js';
import UserGoal from '../models/UserGoal.js';
import Goal from '../models/Goal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getResources = async (req, res, next) => {
  try {
    const { goalId, stageNumber, topicTitle, type, difficulty, search, subject, examLevel } = req.query;

    let targetGoalId = goalId;
    if (goalId && !mongoose.Types.ObjectId.isValid(goalId)) {
      const g = await Goal.findOne({ slug: goalId });
      if (g) targetGoalId = g._id;
    }

    const filter = {};
    if (targetGoalId) filter.goalId = targetGoalId;
    if (stageNumber && stageNumber !== 'all') filter.stageNumber = Number(stageNumber);
    if (topicTitle) filter.topicTitle = new RegExp(topicTitle, 'i');
    if (type && type !== 'all') filter.type = type;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (subject && subject !== 'all') {
      filter.$or = [
        { subject: new RegExp(subject, 'i') },
        { tags: new RegExp(subject, 'i') }
      ];
    }
    if (examLevel && examLevel !== 'all') {
      filter.$or = [
        { examLevel: new RegExp(examLevel, 'i') },
        { tags: new RegExp(examLevel, 'i') }
      ];
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { topicTitle: new RegExp(search, 'i') },
        { provider: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    let resources = await Resource.find(filter).sort({ rating: -1, createdAt: -1 });

    // If zero resources found for a known goal, try to auto-provision from data file
    if (resources.length === 0 && targetGoalId) {
      const goalDoc = await Goal.findById(targetGoalId);
      if (goalDoc) {
        const dataDir = path.join(__dirname, '../data/goals');
        const jsonPath = path.join(dataDir, `${goalDoc.slug}.json`);
        if (fs.existsSync(jsonPath)) {
          try {
            const fileData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            if (fileData.resources && fileData.resources.length > 0) {
              const toInsert = fileData.resources.map(r => ({ ...r, goalId: targetGoalId }));
              await Resource.insertMany(toInsert);
              resources = await Resource.find(filter).sort({ rating: -1, createdAt: -1 });
              console.log(`[ResourceController] Auto-provisioned ${toInsert.length} resources for ${goalDoc.title}`);
            }
          } catch (e) {
            console.error('[ResourceController] Auto-provision error:', e.message);
          }
        }
      }
    }

    // Fetch user bookmarks / selected resources if user is authenticated
    let userSelectedIds = [];
    if (req.user && targetGoalId) {
      const userGoal = await UserGoal.findOne({ userId: req.user._id, goalId: targetGoalId });
      if (userGoal) {
        userSelectedIds = (userGoal.selectedResources || []).map(id => id.toString());
      }
    }

    res.json({
      success: true,
      count: resources.length,
      data: {
        resources,
        userSelectedResourceIds: userSelectedIds
      },
      resources,
      userSelectedIds
    });
  } catch (err) {
    next(err);
  }
};

export const toggleSelectResource = async (req, res, next) => {
  try {
    const { resourceId, goalId } = req.body;
    const userId = req.user._id;

    let targetGoalId = goalId;
    if (goalId && !mongoose.Types.ObjectId.isValid(goalId)) {
      const g = await Goal.findOne({ slug: goalId });
      if (g) targetGoalId = g._id;
    }

    const userGoal = await UserGoal.findOne({ userId, goalId: targetGoalId });
    if (!userGoal) {
      return res.status(404).json({ success: false, message: 'Goal enrollment not found' });
    }

    const idStr = resourceId.toString();
    const index = (userGoal.selectedResources || []).findIndex(r => r.toString() === idStr);

    if (index > -1) {
      userGoal.selectedResources.splice(index, 1);
    } else {
      userGoal.selectedResources = userGoal.selectedResources || [];
      userGoal.selectedResources.push(resourceId);
    }

    await userGoal.save();

    res.json({
      success: true,
      data: {
        selectedResourceIds: userGoal.selectedResources.map(r => r.toString())
      },
      message: index > -1 ? 'Resource removed from study vault' : 'Resource saved to study vault'
    });
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};
