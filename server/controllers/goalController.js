import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import User from '../models/User.js';
import Roadmap from '../models/Roadmap.js';
import { aiService } from '../services/ai/aiService.js';

export const getAllGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find().sort({ isCustom: 1, createdAt: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    next(err);
  }
};

export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const selectGoal = async (req, res, next) => {
  try {
    const { goalId, targetDate, hoursPerDay, currentLevel, currentKnowledge } = req.body;
    const userId = req.user._id;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Deactivate other user goals so that only this goal is active
    await UserGoal.updateMany({ userId }, { status: 'inactive' });

    // Check if UserGoal already exists
    let userGoal = await UserGoal.findOne({ userId, goalId });

    if (userGoal) {
      userGoal.targetDate = targetDate || userGoal.targetDate;
      userGoal.hoursPerDay = hoursPerDay || userGoal.hoursPerDay;
      userGoal.hoursPerWeek = (hoursPerDay || userGoal.hoursPerDay) * 7;
      userGoal.currentLevel = currentLevel || userGoal.currentLevel;
      userGoal.status = 'active';
      if (currentKnowledge) userGoal.currentKnowledge = currentKnowledge;
      await userGoal.save();
    } else {
      userGoal = await UserGoal.create({
        userId,
        goalId,
        targetDate: targetDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // default 6 months
        hoursPerDay: hoursPerDay || 2,
        hoursPerWeek: (hoursPerDay || 2) * 7,
        currentLevel: currentLevel || 'beginner',
        currentKnowledge: currentKnowledge || [],
        status: 'active'
      });
    }

    // Set as active goal for user
    await User.findByIdAndUpdate(userId, { activeGoal: userGoal._id });

    const populatedUserGoal = await UserGoal.findById(userGoal._id).populate('goalId');

    res.status(200).json({
      success: true,
      data: populatedUserGoal,
      message: `Goal "${goal.title}" activated successfully!`,
    });
  } catch (err) {
    next(err);
  }
};

export const createCustomGoal = async (req, res, next) => {
  try {
    const { title, currentLevel, targetMonths, hoursPerDay } = req.body;
    const userId = req.user._id;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    // Leverage future-ready AI Service Abstraction to decompose the custom goal
    const decomposed = await aiService.decomposeGoal(title, currentLevel, targetMonths || 6);

    const goalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const goal = await Goal.create({
      title: decomposed.title,
      slug: goalSlug,
      category: 'custom',
      description: decomposed.description,
      tagline: `Custom curriculum for ${decomposed.title}`,
      icon: 'Sparkles',
      badgeColor: 'purple',
      estimatedMonths: targetMonths || 6,
      targetRoles: decomposed.targetRoles,
      careerPath: decomposed.careerPath,
      isCustom: true,
      createdBy: userId
    });

    // Create corresponding Roadmap for this custom goal
    await Roadmap.create({
      goalId: goal._id,
      title: `${decomposed.title} Roadmap`,
      totalEstimatedHours: (targetMonths || 6) * 30 * (hoursPerDay || 2),
      stages: decomposed.stages
    });

    // Automatically enroll user into this new custom goal
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + (Number(targetMonths) || 6));

    const userGoal = await UserGoal.create({
      userId,
      goalId: goal._id,
      targetDate,
      hoursPerDay: Number(hoursPerDay) || 2,
      hoursPerWeek: (Number(hoursPerDay) || 2) * 7,
      currentLevel: currentLevel || 'beginner',
      status: 'active'
    });

    await User.findByIdAndUpdate(userId, { activeGoal: userGoal._id });

    const populatedUserGoal = await UserGoal.findById(userGoal._id).populate('goalId');

    res.status(201).json({
      success: true,
      data: populatedUserGoal,
      message: `Custom goal "${goal.title}" created and decomposed into stages successfully!`,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyGoals = async (req, res, next) => {
  try {
    const userGoals = await UserGoal.find({ userId: req.user._id }).populate('goalId');
    res.json({ success: true, count: userGoals.length, data: userGoals });
  } catch (err) {
    next(err);
  }
};

export const switchActiveGoal = async (req, res, next) => {
  try {
    const { userGoalId } = req.body;
    const userGoal = await UserGoal.findOne({ _id: userGoalId, userId: req.user._id }).populate('goalId');
    if (!userGoal) {
      return res.status(404).json({ success: false, message: 'Goal enrollment not found' });
    }

    await UserGoal.updateMany({ userId: req.user._id }, { status: 'inactive' });
    userGoal.status = 'active';
    await userGoal.save();

    await User.findByIdAndUpdate(req.user._id, { activeGoal: userGoal._id });

    res.json({
      success: true,
      data: userGoal,
      message: `Active goal switched to ${userGoal.goalId.title}`,
    });
  } catch (err) {
    next(err);
  }
};
