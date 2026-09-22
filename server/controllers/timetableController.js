import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import UserGoal from '../models/UserGoal.js';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
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

export const updateScheduleBlock = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const blockId = req.params.blockId || req.body.blockId || req.body._id;
    const {
      timetableId,
      title,
      startTime,
      endTime,
      durationMinutes,
      dayOfWeek,
      blockType,
      topicTitle,
      stageNumber
    } = req.body;

    if (!blockId) {
      return res.status(400).json({
        success: false,
        message: 'Schedule block ID (blockId) is required to update a schedule block.'
      });
    }

    // 1. Locate the timetable belonging to this authenticated user
    let timetable = null;
    if (timetableId && mongoose.Types.ObjectId.isValid(timetableId)) {
      timetable = await Timetable.findOne({ _id: timetableId, userId });
    }

    // If not found by timetableId or timetableId not provided, locate by blockId + userId
    if (!timetable) {
      timetable = await Timetable.findOne({
        userId,
        'blocks._id': blockId
      });
    }

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable or schedule block not found for this user.'
      });
    }

    // 2. Locate the specific block subdocument
    const block = timetable.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Schedule block not found in the timetable.'
      });
    }

    // 3. Validate permitted fields
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (dayOfWeek && !validDays.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: `Invalid dayOfWeek. Must be one of: ${validDays.join(', ')}`
      });
    }

    const validBlockTypes = ['study', 'practice', 'review', 'project', 'break'];
    if (blockType && !validBlockTypes.includes(blockType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blockType. Must be one of: ${validBlockTypes.join(', ')}`
      });
    }

    // Helper: convert time string ("09:00 AM", "14:30") to minutes from midnight
    const timeToMinutes = (str) => {
      if (!str) return null;
      const match = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const mins = parseInt(match[2], 10);
      const meridian = match[3] ? match[3].toUpperCase() : null;
      if (meridian === 'PM' && hours < 12) hours += 12;
      if (meridian === 'AM' && hours === 12) hours = 0;
      return hours * 60 + mins;
    };

    const targetDay = dayOfWeek || block.dayOfWeek;
    const targetStart = startTime || block.startTime;
    const targetEnd = endTime || block.endTime;

    const startMins = timeToMinutes(targetStart);
    const endMins = timeToMinutes(targetEnd);

    if (startMins !== null && endMins !== null && endMins <= startMins) {
      return res.status(400).json({
        success: false,
        message: 'End time must be strictly later than start time.'
      });
    }

    // Check for overlap with other blocks on the same day in this timetable
    if (startMins !== null && endMins !== null) {
      const conflictingBlock = timetable.blocks.find(b => {
        if (b._id.toString() === blockId.toString()) return false;
        if (b.dayOfWeek !== targetDay) return false;
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        if (bStart === null || bEnd === null) return false;
        return Math.max(startMins, bStart) < Math.min(endMins, bEnd);
      });

      if (conflictingBlock) {
        return res.status(400).json({
          success: false,
          message: `Time slot overlaps with existing block "${conflictingBlock.title}" (${conflictingBlock.startTime} - ${conflictingBlock.endTime}) on ${targetDay}.`
        });
      }
    }

    // 4. Update permitted fields on the block
    if (title !== undefined) block.title = title.trim();
    if (startTime !== undefined) block.startTime = startTime;
    if (endTime !== undefined) block.endTime = endTime;
    if (durationMinutes !== undefined) {
      block.durationMinutes = Number(durationMinutes);
    } else if (startMins !== null && endMins !== null) {
      block.durationMinutes = endMins - startMins;
    }
    if (dayOfWeek !== undefined) block.dayOfWeek = dayOfWeek;
    if (blockType !== undefined) block.blockType = blockType;
    if (topicTitle !== undefined) block.topicTitle = topicTitle;
    if (stageNumber !== undefined) block.stageNumber = Number(stageNumber);

    await timetable.save();

    // 5. Synchronize with corresponding Task if linked
    if (block.taskId) {
      const taskUpdate = {};
      if (title !== undefined) taskUpdate.title = title.trim();
      if (startTime !== undefined) taskUpdate.startTime = startTime;
      if (endTime !== undefined) taskUpdate.endTime = endTime;
      if (block.durationMinutes) taskUpdate.durationMinutes = block.durationMinutes;

      if (dayOfWeek !== undefined && timetable.weekStartDate) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIdx = days.indexOf(dayOfWeek);
        const weekStart = new Date(timetable.weekStartDate);
        const startDayIdx = weekStart.getDay();
        let diff = targetDayIdx - startDayIdx;
        if (diff < 0) diff += 7;
        const newDate = new Date(weekStart);
        newDate.setDate(weekStart.getDate() + diff);
        taskUpdate.date = newDate.toISOString().split('T')[0];
      }

      await Task.findByIdAndUpdate(block.taskId, taskUpdate).catch(e => console.warn('Task sync warn:', e.message));
    }

    res.json({
      success: true,
      data: {
        timetableId: timetable._id,
        block
      },
      message: 'Schedule block updated successfully.'
    });
  } catch (err) {
    next(err);
  }
};
