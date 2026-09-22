import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Roadmap from '../models/Roadmap.js';
import Goal from '../models/Goal.js';
import Resource from '../models/Resource.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getOrProvisionRoadmap = async (idOrSlug) => {
  if (!idOrSlug) {
    idOrSlug = 'jee-mains-advanced';
  }

  // 1. Try finding in MongoDB by goalId, slug, or _id
  let query = { slug: idOrSlug };
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    query = {
      $or: [
        { goalId: idOrSlug },
        { _id: idOrSlug },
        { slug: idOrSlug }
      ]
    };
  }

  let roadmap = await Roadmap.findOne(query);
  if (roadmap && roadmap.stages && roadmap.stages.length > 0) {
    return roadmap;
  }

  // 2. Identify the target slug
  let targetSlug = typeof idOrSlug === 'string' ? idOrSlug : null;
  let targetGoal = null;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    targetGoal = await Goal.findById(idOrSlug);
    if (targetGoal?.slug) {
      targetSlug = targetGoal.slug;
    }
  } else {
    targetGoal = await Goal.findOne({ slug: targetSlug });
  }

  if (!targetSlug) {
    targetSlug = 'jee-mains-advanced';
  }

  // 3. Look up JSON seed data on disk
  const jsonPath = path.join(__dirname, `../data/goals/${targetSlug}.json`);
  if (!fs.existsSync(jsonPath)) {
    // If specific slug not found on disk, fallback to jee-mains-advanced
    const fallbackPath = path.join(__dirname, '../data/goals/jee-mains-advanced.json');
    if (!fs.existsSync(fallbackPath)) {
      throw new Error(`Roadmap data file not found for goal: ${targetSlug}`);
    }
    const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    if (!targetGoal) {
      targetGoal = await Goal.findOne({ slug: 'jee-mains-advanced' });
      if (!targetGoal) {
        targetGoal = await Goal.create(fallbackData.goal);
      }
    }

    roadmap = await Roadmap.create({
      goalId: targetGoal._id,
      slug: targetGoal.slug || 'jee-mains-advanced',
      title: fallbackData.roadmap.title,
      totalEstimatedHours: fallbackData.roadmap.totalEstimatedHours,
      stages: fallbackData.roadmap.stages
    });
    return roadmap;
  }

  // Read JSON data
  const goalData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Ensure Goal document exists in DB
  if (!targetGoal) {
    targetGoal = await Goal.findOne({ slug: targetSlug });
    if (!targetGoal && goalData.goal) {
      targetGoal = await Goal.create(goalData.goal);
    }
  }

  if (!targetGoal) {
    targetGoal = await Goal.create({
      title: goalData.roadmap.title,
      slug: targetSlug,
      description: goalData.roadmap.title,
      category: targetSlug.includes('jee') ? 'engineering_exams' : 'web_dev',
    });
  }

  // Create or update Roadmap in MongoDB
  roadmap = await Roadmap.findOneAndUpdate(
    { $or: [{ goalId: targetGoal._id }, { slug: targetSlug }] },
    {
      goalId: targetGoal._id,
      slug: targetSlug,
      title: goalData.roadmap.title,
      totalEstimatedHours: goalData.roadmap.totalEstimatedHours,
      stages: goalData.roadmap.stages
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Auto-seed resources if none exist for this goal
  const resourceCount = await Resource.countDocuments({ goalId: targetGoal._id });
  if (resourceCount === 0 && goalData.resources?.length > 0) {
    const resourcesToInsert = goalData.resources.map(r => ({
      ...r,
      goalId: targetGoal._id
    }));
    await Resource.insertMany(resourcesToInsert).catch(e => console.warn('Resource seed warn:', e.message));
  }

  return roadmap;
};
