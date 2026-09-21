import { calculateStudentProgress } from '../services/progressService.js';
import UserGoal from '../models/UserGoal.js';

export const getProgressSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userGoalId } = req.query;

    let targetUserGoalId = userGoalId;
    if (!targetUserGoalId) {
      if (req.user.activeGoal) {
        targetUserGoalId = req.user.activeGoal;
      } else {
        const firstGoal = await UserGoal.findOne({ userId, status: 'active' });
        if (!firstGoal) {
          return res.json({
            success: true,
            data: null,
            message: 'No active goal selected yet. Choose a goal to start tracking progress.'
          });
        }
        targetUserGoalId = firstGoal._id;
      }
    }

    const progress = await calculateStudentProgress(userId, targetUserGoalId);

    res.json({
      success: true,
      data: progress
    });
  } catch (err) {
    next(err);
  }
};
