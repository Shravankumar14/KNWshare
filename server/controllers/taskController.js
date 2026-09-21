import Task from '../models/Task.js';
import UserGoal from '../models/UserGoal.js';
import { reschedulePendingTasksIntelligently, rescheduleSingleTask } from '../services/taskSchedulerService.js';
import { calculateStudentProgress } from '../services/progressService.js';

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, date, userGoalId, priority } = req.query;

    const query = { userId };
    if (status && status !== 'all') query.status = status;
    if (date) query.date = date;
    if (priority && priority !== 'all') query.priority = priority;

    if (userGoalId) {
      query.userGoalId = userGoalId;
    } else if (req.user.activeGoal) {
      query.userGoalId = req.user.activeGoal;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Automatically mark past pending tasks as overdue if date has passed
    await Task.updateMany(
      { userId, status: 'pending', date: { $lt: todayStr } },
      { $set: { status: 'overdue' } }
    );

    const tasks = await Task.find(query).sort({ date: 1, startTime: 1 });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => ['pending', 'in_progress', 'rescheduled'].includes(t.status)).length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;

    res.json({
      success: true,
      data: tasks,
      summary: { total, completed, pending, overdue }
    });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      durationMinutes,
      priority,
      userGoalId,
      stageNumber,
      topicTitle,
    } = req.body;

    const targetUserGoalId = userGoalId || req.user.activeGoal;
    const userGoal = await UserGoal.findById(targetUserGoalId);
    if (!userGoal) {
      return res.status(400).json({ success: false, message: 'Active goal required to create a task' });
    }

    const task = await Task.create({
      userId,
      userGoalId: targetUserGoalId,
      goalId: userGoal.goalId,
      stageNumber: stageNumber || 1,
      topicTitle: topicTitle || 'Self Study',
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '10:00 AM',
      endTime: endTime || '11:00 AM',
      durationMinutes: Number(durationMinutes) || 60,
      priority: priority || 'medium',
      status: 'pending',
      originalDate: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    // Recalculate progress
    const progress = await calculateStudentProgress(userId, task.userGoalId);

    res.json({
      success: true,
      data: task,
      progressMetrics: progress.metrics,
      message: `Task marked as ${status}`
    });
  } catch (err) {
    next(err);
  }
};

export const rescheduleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newDate } = req.body;
    const userId = req.user._id;

    if (!newDate) {
      return res.status(400).json({ success: false, message: 'New date is required' });
    }

    const updatedTask = await rescheduleSingleTask(id, userId, newDate);
    res.json({ success: true, data: updatedTask, message: 'Task rescheduled successfully' });
  } catch (err) {
    next(err);
  }
};

export const rescheduleAllPending = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userGoalId } = req.body;

    const targetUserGoalId = userGoalId || req.user.activeGoal;
    if (!targetUserGoalId) {
      return res.status(400).json({ success: false, message: 'Active goal required' });
    }

    const result = await reschedulePendingTasksIntelligently(userId, targetUserGoalId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
