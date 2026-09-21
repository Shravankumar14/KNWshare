import Task from '../models/Task.js';
import UserGoal from '../models/UserGoal.js';
import Roadmap from '../models/Roadmap.js';

export const calculateStudentProgress = async (userId, userGoalId) => {
  const userGoal = await UserGoal.findById(userGoalId).populate('goalId');
  if (!userGoal) {
    throw new Error('User goal not found');
  }

  const roadmap = await Roadmap.findOne({ goalId: userGoal.goalId._id });
  const tasks = await Task.find({ userId, userGoalId });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => ['pending', 'rescheduled', 'in_progress'].includes(t.status));
  const overdueTasks = tasks.filter(t => t.status === 'overdue');

  const totalMinutesStudied = completedTasks.reduce((acc, t) => acc + (t.durationMinutes || 60), 0);
  const totalHoursStudied = Number((totalMinutesStudied / 60).toFixed(1));

  // Compute stage breakdown
  const stagesProgress = (roadmap?.stages || []).map(stage => {
    const stageTasks = tasks.filter(t => t.stageNumber === stage.stageNumber);
    const stageCompleted = stageTasks.filter(t => t.status === 'completed');
    const percent = stageTasks.length > 0 
      ? Math.round((stageCompleted.length / stageTasks.length) * 100) 
      : 0;

    return {
      stageNumber: stage.stageNumber,
      title: stage.title,
      totalTasks: stageTasks.length,
      completedTasks: stageCompleted.length,
      percent,
      isFinished: percent === 100 && stageTasks.length > 0
    };
  });

  // Goal completion %
  const overallPercentage = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0;

  // Update overall progress in UserGoal
  userGoal.overallProgress = overallPercentage;
  await userGoal.save();

  // Streak calculation based on completion dates
  const completionDates = [...new Set(completedTasks
    .filter(t => t.completedAt)
    .map(t => new Date(t.completedAt).toISOString().split('T')[0]))].sort().reverse();

  let streak = 0;
  if (completionDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (completionDates[0] === today || completionDates[0] === yesterday) {
      streak = 1;
      let checkDate = new Date(completionDates[0]);
      for (let i = 1; i < completionDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expected = checkDate.toISOString().split('T')[0];
        if (completionDates[i] === expected) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    goal: {
      id: userGoal.goalId._id,
      title: userGoal.goalId.title,
      category: userGoal.goalId.category,
      targetDate: userGoal.targetDate,
      currentLevel: userGoal.currentLevel,
      hoursPerDay: userGoal.hoursPerDay,
    },
    metrics: {
      overallPercentage,
      totalTasks,
      completedTasksCount: completedTasks.length,
      pendingTasksCount: pendingTasks.length,
      overdueTasksCount: overdueTasks.length,
      totalHoursStudied,
      streakDays: streak,
    },
    stagesProgress,
    milestones: [
      {
        title: 'First Step Taken',
        description: 'Completed your first study task on KNWshare',
        achieved: completedTasks.length >= 1,
      },
      {
        title: 'Deep Focus Master',
        description: 'Completed 5 hours of focused learning',
        achieved: totalHoursStudied >= 5,
      },
      {
        title: 'Consistency Champion',
        description: 'Maintained a 3-day study streak',
        achieved: streak >= 3,
      },
      {
        title: 'Stage Pioneer',
        description: 'Completed 100% of a roadmap stage',
        achieved: stagesProgress.some(s => s.isFinished),
      }
    ]
  };
};
