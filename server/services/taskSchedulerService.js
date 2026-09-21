import Task from '../models/Task.js';
import UserGoal from '../models/UserGoal.js';
import Notification from '../models/Notification.js';

export const reschedulePendingTasksIntelligently = async (userId, userGoalId) => {
  const userGoal = await UserGoal.findById(userGoalId);
  if (!userGoal) {
    throw new Error('User goal not found');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyMaxMinutes = (userGoal.hoursPerDay || 2) * 60;
  // Maximum tolerance before overloading a day (120% of normal capacity)
  const maxCapacityPerDayMinutes = Math.round(dailyMaxMinutes * 1.2);

  // Find all tasks that are pending or overdue from today or before
  const pendingTasks = await Task.find({
    userId,
    userGoalId,
    status: { $in: ['pending', 'overdue'] },
    date: { $lte: todayStr }
  }).sort({ priority: -1, date: 1 }); // high priority first, oldest first

  if (pendingTasks.length === 0) {
    return {
      rescheduledCount: 0,
      message: 'No pending or overdue tasks require rescheduling.',
      rescheduledTasks: []
    };
  }

  // Look ahead over next 7 days
  const futureDays = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    futureDays.push(d.toISOString().split('T')[0]);
  }

  // Preload existing workload for each future day
  const existingTasks = await Task.find({
    userId,
    userGoalId,
    date: { $in: futureDays },
    status: { $ne: 'completed' }
  });

  const dailyLoads = {};
  futureDays.forEach(day => {
    const dayTasks = existingTasks.filter(t => t.date === day);
    dailyLoads[day] = dayTasks.reduce((acc, t) => acc + (t.durationMinutes || 60), 0);
  });

  const rescheduledTasks = [];

  for (const task of pendingTasks) {
    // Find the earliest day with capacity
    let targetDay = null;
    const taskDuration = task.durationMinutes || 60;

    for (const day of futureDays) {
      if (dailyLoads[day] + taskDuration <= maxCapacityPerDayMinutes) {
        targetDay = day;
        dailyLoads[day] += taskDuration;
        break;
      }
    }

    // If all days are near capacity, place on the day with the minimum load
    if (!targetDay) {
      targetDay = futureDays.reduce((minDay, currentDay) => 
        dailyLoads[currentDay] < dailyLoads[minDay] ? currentDay : minDay
      , futureDays[0]);
      dailyLoads[targetDay] += taskDuration;
    }

    task.date = targetDay;
    task.status = 'rescheduled';
    task.rescheduleCount = (task.rescheduleCount || 0) + 1;
    task.rescheduleReason = 'Intelligently redistributed to prevent overload';
    await task.save();

    rescheduledTasks.push({
      taskId: task._id,
      title: task.title,
      newDate: targetDay,
      rescheduleCount: task.rescheduleCount
    });
  }

  // Create notification
  await Notification.create({
    userId,
    title: 'Tasks Intelligently Balanced',
    message: `${rescheduledTasks.length} pending task(s) were smoothly redistributed across your upcoming study days without overloading your schedule.`,
    type: 'pending_rescheduled',
    link: '/tasks'
  });

  return {
    rescheduledCount: rescheduledTasks.length,
    rescheduledTasks,
    message: `Successfully rescheduled ${rescheduledTasks.length} task(s) intelligently.`
  };
};

export const rescheduleSingleTask = async (taskId, userId, newDate) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new Error('Task not found');
  }

  task.date = newDate;
  task.status = 'rescheduled';
  task.rescheduleCount = (task.rescheduleCount || 0) + 1;
  task.rescheduleReason = 'Manually rescheduled by student';
  await task.save();

  return task;
};
