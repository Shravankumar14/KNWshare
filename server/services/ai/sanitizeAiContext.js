/**
 * Sanitizes student context for AI ingestion.
 * Strictly whitelists permitted fields to prevent leakage of credentials, tokens,
 * password hashes, raw database chains, or other users' information.
 */
export function sanitizeAiContext({ user, activeGoal, goalProfile, progress, tasks }) {
  return {
    studentName: user?.name ? String(user.name).split(' ')[0] : 'Student',
    userRole: user?.role || 'student',
    activeGoal: activeGoal ? {
      title: activeGoal.title || '',
      slug: activeGoal.slug || '',
      category: activeGoal.category || ''
    } : null,
    levelAndPacing: goalProfile ? {
      level: goalProfile.level || 'beginner',
      hoursPerDay: goalProfile.hoursPerDay || 2,
      daysPerWeek: goalProfile.daysPerWeek || 6,
      targetTimelineWeeks: goalProfile.targetTimelineWeeks || 24
    } : null,
    progressSummary: progress ? {
      overallProgress: typeof progress.overallProgress === 'number' ? progress.overallProgress : 0,
      currentStage: progress.currentStage || 1,
      completedStagesCount: Array.isArray(progress.completedStages) ? progress.completedStages.length : 0,
      completedTopicsCount: Array.isArray(progress.completedTopics) ? progress.completedTopics.length : 0
    } : null,
    upcomingTasks: Array.isArray(tasks) ? tasks.slice(0, 5).map(t => ({
      title: t.title,
      date: t.date,
      startTime: t.startTime,
      durationMinutes: t.durationMinutes,
      status: t.status
    })) : []
  };
}
