import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Resource from '../models/Resource.js';
import UserGoal from '../models/UserGoal.js';
import Goal from '../models/Goal.js';
import TeacherContent from '../models/TeacherContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getResources = async (req, res, next) => {
  try {
    const { goalId, goal, stageNumber, topicTitle, type, difficulty, search, subject, examLevel } = req.query;

    const rawGoal = goalId || goal;
    let targetGoalId = rawGoal;
    let targetGoalSlug = null;

    if (rawGoal) {
      if (!mongoose.Types.ObjectId.isValid(rawGoal)) {
        const g = await Goal.findOne({ slug: rawGoal });
        if (g) {
          targetGoalId = g._id;
          targetGoalSlug = g.slug;
        } else {
          targetGoalSlug = rawGoal;
        }
      } else {
        const g = await Goal.findById(rawGoal);
        if (g) targetGoalSlug = g.slug;
      }
    }

    const filter = {};
    if (targetGoalId && mongoose.Types.ObjectId.isValid(targetGoalId)) {
      filter.goalId = targetGoalId;
    }
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
    if (resources.length === 0 && targetGoalId && mongoose.Types.ObjectId.isValid(targetGoalId)) {
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

    // Query published TeacherContent (Faculty study notes & educational materials)
    const tcFilter = { visibility: 'published' };
    if (targetGoalSlug) {
      // Relaxed slug regex to match goal variants e.g. jee-main-advanced vs jee-mains-advanced
      const slugPattern = targetGoalSlug.replace(/s?-/g, '.*');
      tcFilter.$or = [
        { goalSlug: new RegExp(slugPattern, 'i') },
        { goalSlug: targetGoalSlug }
      ];
    }
    if (stageNumber && stageNumber !== 'all') {
      tcFilter.stageNumber = Number(stageNumber);
    }
    if (topicTitle) {
      tcFilter.topic = new RegExp(topicTitle, 'i');
    }
    if (subject && subject !== 'all') {
      tcFilter.subject = new RegExp(subject, 'i');
    }
    if (search) {
      tcFilter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { topic: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') }
      ];
    }

    const teacherMaterials = await TeacherContent.find(tcFilter)
      .populate('teacherId', 'name avatar')
      .populate('teacherProfileId', 'headline photo rating')
      .sort({ createdAt: -1 });

    let teacherResources = teacherMaterials.map(tm => ({
      _id: tm._id,
      goalId: targetGoalId,
      stageNumber: tm.stageNumber || 1,
      topicTitle: tm.topic || tm.subject,
      title: tm.title,
      description: tm.description || `Study material prepared by faculty for ${tm.subject}`,
      url: tm.mediaUrl,
      provider: tm.teacherProfileId?.headline || 'Verified Faculty Mentor',
      author: tm.teacherId?.name || tm.teacherProfileId?.name || 'Verified Faculty',
      type: tm.contentType === 'pdf' ? 'notes' : (tm.contentType === 'video' ? 'video' : 'documentation'),
      free: true,
      isFree: true,
      language: 'English',
      sourceType: 'teacher',
      verified: true,
      isVerified: true,
      difficulty: 'all_levels',
      examLevel: tm.goalTitle || 'Competitive Exam',
      rating: tm.teacherProfileId?.rating || 4.95,
      reviewsCount: tm.viewCount || 1,
      estimatedHours: 2,
      tags: [tm.subject, tm.topic, tm.contentType].filter(Boolean),
      teacherId: tm.teacherId?._id || tm.teacherId,
      teacherProfileId: tm.teacherProfileId?._id || tm.teacherProfileId,
      createdAt: tm.createdAt
    }));

    if (type && type !== 'all') {
      teacherResources = teacherResources.filter(tr => {
        if (type === 'notes' || type === 'documentation') {
          return tr.type === 'notes' || tr.type === 'documentation';
        }
        return tr.type === type;
      });
    }

    const combinedResources = [...teacherResources, ...resources];

    // Fetch user bookmarks / selected resources if user is authenticated
    let userSelectedIds = [];
    if (req.user && targetGoalId && mongoose.Types.ObjectId.isValid(targetGoalId)) {
      const userGoal = await UserGoal.findOne({ userId: req.user._id, goalId: targetGoalId });
      if (userGoal) {
        userSelectedIds = (userGoal.selectedResources || []).map(id => id.toString());
      }
    }

    res.json({
      success: true,
      count: combinedResources.length,
      data: {
        resources: combinedResources,
        userSelectedResourceIds: userSelectedIds
      },
      resources: combinedResources,
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
