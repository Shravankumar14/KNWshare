import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import UserGoal from '../models/UserGoal.js';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { generateWeeklyTimetable } from '../services/timetableService.js';

export const generateTimetable = async (req, res, next) => {
  try {
    const { userGoalId, goalId, goalSlug, availableDays, dailyHours, preferredSlot, includeBreaks } = req.body;
    const userId = req.user._id;

    // 1. Resolve userGoal:
    let targetUserGoal = null;

    if (userGoalId && mongoose.Types.ObjectId.isValid(userGoalId)) {
      targetUserGoal = await UserGoal.findById(userGoalId).populate('goalId');
    }

    if (!targetUserGoal && (goalId || goalSlug)) {
      let goal = null;
      if (goalId && mongoose.Types.ObjectId.isValid(goalId)) {
        goal = await Goal.findById(goalId);
      }
      if (!goal && (goalSlug || goalId)) {
        goal = await Goal.findOne({ slug: goalSlug || goalId });
      }

      if (goal) {
        targetUserGoal = await UserGoal.findOne({ userId, goalId: goal._id }).populate('goalId');
        if (!targetUserGoal) {
          // Auto-enroll user in this goal so timetable generation succeeds seamlessly
          targetUserGoal = await UserGoal.create({
            userId,
            goalId: goal._id,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            hoursPerDay: Number(dailyHours) || 2,
            hoursPerWeek: (Number(dailyHours) || 2) * 7,
            status: 'active'
          });
          targetUserGoal = await targetUserGoal.populate('goalId');
        }
      }
    }

    if (!targetUserGoal) {
      if (req.user.activeGoal) {
        targetUserGoal = await UserGoal.findById(req.user.activeGoal).populate('goalId');
      }
      if (!targetUserGoal) {
        targetUserGoal = await UserGoal.findOne({ userId, status: 'active' }).populate('goalId');
      }
      if (!targetUserGoal) {
        let primaryGoal = await Goal.findOne({ slug: 'jee-mains-advanced' });
        if (!primaryGoal) {
          primaryGoal = await Goal.findOne();
        }
        if (primaryGoal) {
          targetUserGoal = await UserGoal.create({
            userId,
            goalId: primaryGoal._id,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            hoursPerDay: Number(dailyHours) || 2,
            hoursPerWeek: (Number(dailyHours) || 2) * 7,
            status: 'active'
          });
          targetUserGoal = await targetUserGoal.populate('goalId');
        }
      }
    }

    if (!targetUserGoal) {
      return res.status(400).json({ success: false, message: 'Please select a goal first before generating a timetable.' });
    }

    // Set as active goal for user
    await User.findByIdAndUpdate(userId, { activeGoal: targetUserGoal._id });

    const result = await generateWeeklyTimetable({
      userId,
      userGoalId: targetUserGoal._id,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dailyHours: Number(dailyHours) || 2,
      preferredSlot: preferredSlot || 'morning',
      includeBreaks: includeBreaks !== false
    });

    res.status(201).json({
      success: true,
      data: result.timetable,
      tasksGenerated: result.tasks.length,
      message: `Personalized weekly timetable generated successfully with ${result.tasks.length} actionable tasks!`
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentTimetable = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userGoalId, goalId, goalSlug } = req.query;

    const query = { userId };
    if (userGoalId && mongoose.Types.ObjectId.isValid(userGoalId)) {
      query.userGoalId = userGoalId;
    } else if (goalId || goalSlug) {
      let goal = null;
      if (goalId && mongoose.Types.ObjectId.isValid(goalId)) {
        goal = await Goal.findById(goalId);
      }
      if (!goal && (goalSlug || goalId)) {
        goal = await Goal.findOne({ slug: goalSlug || goalId });
      }
      if (goal) {
        const ug = await UserGoal.findOne({ userId, goalId: goal._id });
        if (ug) {
          query.userGoalId = ug._id;
        }
      }
    } else if (req.user.activeGoal) {
      query.userGoalId = req.user.activeGoal;
    }

    const timetable = await Timetable.findOne(query).sort({ createdAt: -1 }).populate('blocks.taskId');

    res.json({
      success: true,
      data: timetable || null
    });
  } catch (err) {
    next(err);
  }
};
