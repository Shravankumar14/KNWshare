import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import Roadmap from '../models/Roadmap.js';
import RoadmapStage from '../models/RoadmapStage.js';
import RoadmapTopic from '../models/RoadmapTopic.js';
import Resource from '../models/Resource.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserRoadmapProgress from '../models/UserRoadmapProgress.js';
import User from '../models/User.js';
import { calculatePersonalizedPacing } from '../services/personalizationEngine.js';

// Helper to resolve canonical slug
const resolveGoalSlug = (slug) => {
  if (!slug) return 'jee-main-advanced';
  if (slug === 'jee-mains-advanced') return 'jee-main-advanced';
  return slug;
};

// ==========================================
// 1. GOALS & ROADMAPS
// ==========================================

/**
 * GET /api/goals
 * List all active goals
 */
export const getActiveGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ active: { $ne: false } }).sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/goals/:goalSlug/roadmap
 * Full roadmap (stages + topics), goal-scoped with zero cross-goal leakage
 */
export const getGoalRoadmap = async (req, res, next) => {
  try {
    const targetSlug = resolveGoalSlug(req.params.goalSlug);

    // 1. Find Goal
    const goal = await Goal.findOne({
      $or: [
        { slug: targetSlug },
        { slug: req.params.goalSlug },
        ...(mongoose.Types.ObjectId.isValid(req.params.goalSlug) ? [{ _id: req.params.goalSlug }] : [])
      ]
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: `Goal not found for slug '${req.params.goalSlug}'. No fallback permitted.`
      });
    }

    // 2. Find Roadmap
    let roadmap = await Roadmap.findOne({ goalId: goal._id, active: { $ne: false } });
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: `No roadmap found for goal '${goal.title}'.`
      });
    }

    // 3. Fetch Stages and Topics
    let stages = await RoadmapStage.find({ roadmapId: roadmap._id }).sort({ order: 1, stageNumber: 1 });

    if (stages.length > 0) {
      const stageIds = stages.map((s) => s._id);
      const topics = await RoadmapTopic.find({ stageId: { $in: stageIds } }).sort({ order: 1 });

      // Group topics under their stage
      const topicsByStage = new Map();
      topics.forEach((t) => {
        const sKey = t.stageId.toString();
        if (!topicsByStage.has(sKey)) topicsByStage.set(sKey, []);
        topicsByStage.get(sKey).push(t);
      });

      stages = stages.map((stage) => {
        const stageObj = stage.toObject();
        stageObj.topics = topicsByStage.get(stage._id.toString()) || [];
        return stageObj;
      });
    } else if (roadmap.stages && roadmap.stages.length > 0) {
      // Embedded fallback from roadmap document
      stages = roadmap.stages;
    }

    res.json({
      success: true,
      data: {
        goal,
        roadmap: {
          _id: roadmap._id,
          title: roadmap.title,
          version: roadmap.version,
          totalEstimatedHours: roadmap.totalEstimatedHours,
          stages
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/roadmaps/:roadmapId/stages/:stageId
 * Single stage detail + topics
 */
export const getStageDetail = async (req, res, next) => {
  try {
    const { roadmapId, stageId } = req.params;

    let stage = null;
    if (mongoose.Types.ObjectId.isValid(stageId)) {
      stage = await RoadmapStage.findOne({ _id: stageId, roadmapId }).populate('prerequisites');
    }

    if (!stage) {
      // Check embedded in Roadmap
      const roadmap = await Roadmap.findById(roadmapId);
      if (roadmap) {
        stage = roadmap.stages.id(stageId) || roadmap.stages.find((s) => s.stageNumber === Number(stageId));
      }
    }

    if (!stage) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap stage not found.'
      });
    }

    const topics = await RoadmapTopic.find({ stageId: stage._id }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        stage,
        topics
      }
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 2. RESOURCES
// ==========================================

/**
 * GET /api/resources?goal=&stage=&topic=&type=&free=&language=
 * Controlled query filtering with verified rule (§7)
 */
export const getFilteredResources = async (req, res, next) => {
  try {
    const { goal, stage, topic, type, free, language, search } = req.query;
    const query = {};

    // 1. Goal filtering
    if (goal) {
      const canonicalSlug = resolveGoalSlug(goal);
      const goalDoc = await Goal.findOne({
        $or: [
          { slug: canonicalSlug },
          { slug: goal },
          ...(mongoose.Types.ObjectId.isValid(goal) ? [{ _id: goal }] : [])
        ]
      });

      if (goalDoc) {
        query.$or = [
          { goalIds: goalDoc._id },
          { goalId: goalDoc._id }
        ];
      } else {
        // Goal specified but not found: return empty array, no fallback
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    // 2. Stage filtering
    if (stage && stage !== 'all') {
      if (mongoose.Types.ObjectId.isValid(stage)) {
        query.stageIds = stage;
      } else {
        const stageNum = parseInt(stage, 10);
        if (!isNaN(stageNum)) {
          query.stageNumber = stageNum;
        }
      }
    }

    // 3. Topic filtering
    if (topic && topic !== 'all') {
      if (mongoose.Types.ObjectId.isValid(topic)) {
        query.topicIds = topic;
      } else {
        query.topicTitle = new RegExp(topic.trim(), 'i');
      }
    }

    // 4. Type filtering
    if (type && type !== 'all') {
      query.type = type;
    }

    // 5. Free / Paid
    if (free !== undefined && free !== 'all') {
      const isFree = free === 'true' || free === true;
      query.$and = [
        ...(query.$and || []),
        { $or: [{ free: isFree }, { isFree }] }
      ];
    }

    // 6. Language
    if (language && language !== 'all') {
      query.language = new RegExp(language, 'i');
    }

    // 7. Search text
    if (search && search.trim()) {
      query.$or = [
        ...(query.$or || []),
        { title: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
        { provider: new RegExp(search.trim(), 'i') }
      ];
    }

    // 8. Visibility rule (§7):
    // External and platform resources are visible.
    // Teacher resources are visible ONLY if verified: true (or if the requester is the teacher owner)
    const requestingUserId = req.user?._id;
    const visibilityFilter = {
      $or: [
        { sourceType: { $in: ['external', 'platform'] } },
        { verified: true },
        { isVerified: true },
        ...(requestingUserId ? [{ createdBy: requestingUserId }] : [])
      ]
    };

    if (query.$and) {
      query.$and.push(visibilityFilter);
    } else {
      query.$and = [visibilityFilter];
    }

    const resources = await Resource.find(query)
      .populate('createdBy', 'name avatar role headline')
      .sort({ verified: -1, rating: -1, createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resources/:id
 */
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'name avatar role headline');
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resources (auth: teacher or admin)
 */
export const createTeacherResource = async (req, res, next) => {
  try {
    const {
      title,
      description,
      url,
      provider,
      type,
      goalId,
      stageId,
      topicId,
      free,
      language
    } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    // Resolve goal
    let goalDoc = null;
    if (goalId) {
      goalDoc = await Goal.findById(goalId);
    }

    const resource = await Resource.create({
      title,
      description: description || '',
      url,
      provider: provider || req.user.name,
      type: type || 'notes',
      free: free !== undefined ? free : true,
      language: language || 'English',
      sourceType: 'teacher',
      createdBy: req.user._id,
      verified: req.user.role === 'admin', // Admins auto-verify, teachers require verification
      goalIds: goalDoc ? [goalDoc._id] : [],
      stageIds: stageId ? [stageId] : [],
      topicIds: topicId ? [topicId] : [],
      goalId: goalDoc ? goalDoc._id : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully. It will appear on student pages once verified.',
      data: resource
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/resources/:id (auth: teacher, owner-only or admin)
 */
export const updateTeacherResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Ownership check
    if (resource.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this resource' });
    }

    const allowedFields = ['title', 'description', 'url', 'provider', 'type', 'free', 'language', 'stageIds', 'topicIds'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });

    await resource.save();
    res.json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resources/:id (auth: teacher, owner-only or admin)
 */
export const deleteTeacherResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await Resource.deleteOne({ _id: resource._id });
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/resources/:id/verify (admin toggle)
 */
export const verifyResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    resource.verified = req.body.verified !== undefined ? !!req.body.verified : true;
    resource.isVerified = resource.verified;
    await resource.save();

    res.json({
      success: true,
      message: `Resource verification set to ${resource.verified}`,
      data: resource
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 3. PERSONALIZATION & PROGRESS
// ==========================================

/**
 * POST /api/users/me/goal-profile
 * Set level, hours/day, days/week, targetTimelineWeeks for a goal
 */
export const saveUserGoalProfile = async (req, res, next) => {
  try {
    const { goalId, goalSlug, level, hoursPerDay, daysPerWeek, targetTimelineWeeks } = req.body;

    const targetSlug = resolveGoalSlug(goalSlug);
    let goalDoc = null;
    if (goalId) {
      goalDoc = await Goal.findById(goalId);
    } else if (targetSlug) {
      goalDoc = await Goal.findOne({
        $or: [{ slug: targetSlug }, { slug: goalSlug }]
      });
    }

    if (!goalDoc) {
      return res.status(400).json({ success: false, message: 'Valid goalId or goalSlug is required' });
    }

    const profile = await UserGoalProfile.findOneAndUpdate(
      { userId: req.user._id, goalId: goalDoc._id },
      {
        userId: req.user._id,
        goalId: goalDoc._id,
        goalSlug: goalDoc.slug,
        level: level || 'beginner',
        hoursPerDay: Number(hoursPerDay) || 2,
        daysPerWeek: Number(daysPerWeek) || 6,
        targetTimelineWeeks: Number(targetTimelineWeeks) || 24,
        status: 'active'
      },
      { upsert: true, new: true }
    );

    // Update user active goal pointer
    await User.findByIdAndUpdate(req.user._id, {
      currentGoalId: goalDoc._id,
      currentGoalSlug: goalDoc.slug
    });

    res.json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/goal-profile/:goalSlug
 */
export const getUserGoalProfile = async (req, res, next) => {
  try {
    const targetSlug = resolveGoalSlug(req.params.goalSlug);
    const goalDoc = await Goal.findOne({
      $or: [
        { slug: targetSlug },
        { slug: req.params.goalSlug },
        ...(mongoose.Types.ObjectId.isValid(req.params.goalSlug) ? [{ _id: req.params.goalSlug }] : [])
      ]
    });

    if (!goalDoc) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    let profile = await UserGoalProfile.findOne({
      userId: req.user._id,
      goalId: goalDoc._id
    });

    if (!profile) {
      return res.json({
        success: true,
        data: null,
        message: 'No goal profile found. User has not configured this goal yet.'
      });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/roadmap/:goalSlug
 * Personalized view: base roadmap + pacing engine + progress merged (§6)
 */
export const getPersonalizedRoadmap = async (req, res, next) => {
  try {
    const targetSlug = resolveGoalSlug(req.params.goalSlug);
    const goal = await Goal.findOne({
      $or: [
        { slug: targetSlug },
        { slug: req.params.goalSlug },
        ...(mongoose.Types.ObjectId.isValid(req.params.goalSlug) ? [{ _id: req.params.goalSlug }] : [])
      ]
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: `Goal '${req.params.goalSlug}' not found. No fallback permitted.`
      });
    }

    const roadmap = await Roadmap.findOne({ goalId: goal._id, active: { $ne: false } });
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: `Roadmap for goal '${goal.title}' not found.`
      });
    }

    // 1. Get stages and topics
    let stages = await RoadmapStage.find({ roadmapId: roadmap._id }).sort({ order: 1, stageNumber: 1 });
    if (stages.length > 0) {
      const stageIds = stages.map((s) => s._id);
      const topics = await RoadmapTopic.find({ stageId: { $in: stageIds } }).sort({ order: 1 });
      const topicsByStage = new Map();
      topics.forEach((t) => {
        const sKey = t.stageId.toString();
        if (!topicsByStage.has(sKey)) topicsByStage.set(sKey, []);
        topicsByStage.get(sKey).push(t);
      });
      stages = stages.map((stage) => {
        const obj = stage.toObject();
        obj.topics = topicsByStage.get(stage._id.toString()) || [];
        return obj;
      });
    } else if (roadmap.stages && roadmap.stages.length > 0) {
      stages = roadmap.stages;
    }

    // 2. Get UserGoalProfile
    let profile = await UserGoalProfile.findOne({
      userId: req.user._id,
      goalId: goal._id
    });

    if (!profile) {
      profile = {
        level: 'beginner',
        hoursPerDay: 2,
        daysPerWeek: 6,
        targetTimelineWeeks: 24
      };
    }

    // 3. Get UserRoadmapProgress
    const progressList = await UserRoadmapProgress.find({
      userId: req.user._id,
      goalId: goal._id,
      status: 'completed'
    });

    const completedTopicIds = progressList.map((p) =>
      p.topicId ? p.topicId.toString() : p.topicKey || p.topicTitle
    );

    // 4. Fetch available verified resources
    const resources = await Resource.find({
      $or: [{ goalIds: goal._id }, { goalId: goal._id }],
      verified: { $ne: false }
    }).select('title provider type url description free topicIds stageIds topicTitle stageNumber');

    // 5. Run Personalization Pacing Engine
    const pacingResult = calculatePersonalizedPacing({
      userGoalProfile: profile,
      stages,
      completedTopicIds,
      resources
    });

    res.json({
      success: true,
      data: {
        goal,
        roadmap: {
          _id: roadmap._id,
          title: roadmap.title,
          stages
        },
        profile,
        completedTopics: completedTopicIds,
        pacing: pacingResult
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/me/progress/:topicId
 * Mark topic status (not_started | in_progress | completed)
 */
export const updateTopicProgress = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { status = 'completed', goalId, goalSlug, topicKey, topicTitle, stageNumber } = req.body;

    let targetGoalId = goalId;
    if (!targetGoalId && goalSlug) {
      const g = await Goal.findOne({ slug: resolveGoalSlug(goalSlug) });
      if (g) targetGoalId = g._id;
    }

    if (!targetGoalId && req.user.currentGoalId) {
      targetGoalId = req.user.currentGoalId;
    }

    if (!targetGoalId) {
      return res.status(400).json({ success: false, message: 'goalId or goalSlug is required' });
    }

    // Find topic
    let topicDoc = null;
    if (mongoose.Types.ObjectId.isValid(topicId)) {
      topicDoc = await RoadmapTopic.findById(topicId);
    }

    const key = topicKey || (topicDoc ? `${topicDoc.order}:${topicDoc.title}` : topicId);

    const progress = await UserRoadmapProgress.findOneAndUpdate(
      {
        userId: req.user._id,
        goalId: targetGoalId,
        $or: [
          ...(topicDoc ? [{ topicId: topicDoc._id }] : []),
          { topicKey: key }
        ]
      },
      {
        userId: req.user._id,
        goalId: targetGoalId,
        topicId: topicDoc ? topicDoc._id : undefined,
        stageNumber: stageNumber || (topicDoc ? 1 : 1),
        topicTitle: topicTitle || (topicDoc ? topicDoc.title : topicId),
        topicKey: key,
        status,
        completedAt: status === 'completed' ? new Date() : null
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: progress
    });
  } catch (err) {
    next(err);
  }
};
