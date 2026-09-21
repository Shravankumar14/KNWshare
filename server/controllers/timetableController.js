import Timetable from '../models/Timetable.js';
import UserGoal from '../models/UserGoal.js';
import { generateWeeklyTimetable } from '../services/timetableService.js';

export const generateTimetable = async (req, res, next) => {
  try {
    const { userGoalId, availableDays, dailyHours, preferredSlot, includeBreaks } = req.body;
    const userId = req.user._id;

    // If userGoalId not explicitly provided, use user's active goal
    let targetUserGoalId = userGoalId;
    if (!targetUserGoalId) {
      if (req.user.activeGoal) {
        targetUserGoalId = req.user.activeGoal;
      } else {
        const firstGoal = await UserGoal.findOne({ userId, status: 'active' });
        if (!firstGoal) {
          return res.status(400).json({ success: false, message: 'Please select a goal first before generating a timetable.' });
        }
        targetUserGoalId = firstGoal._id;
      }
    }

    const result = await generateWeeklyTimetable({
      userId,
      userGoalId: targetUserGoalId,
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
    const { userGoalId } = req.query;

    const query = { userId };
    if (userGoalId) {
      query.userGoalId = userGoalId;
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

export const updateScheduleBlock = async (req, res, next) => {
  try {
    const { timetableId, blockId, title, startTime, endTime } = req.body;
    const timetable = await Timetable.findOne({ _id: timetableId, userId: req.user._id });
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    const block = timetable.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({ success: false, message: 'Schedule block not found' });
    }

    if (title) block.title = title;
    if (startTime) block.startTime = startTime;
    if (endTime) block.endTime = endTime;

    await timetable.save();

    res.json({ success: true, data: timetable, message: 'Schedule block updated' });
  } catch (err) {
    next(err);
  }
};
