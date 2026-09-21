import Roadmap from '../models/Roadmap.js';
import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import ExpertProfile from '../models/ExpertProfile.js';

export const getRoadmapByGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const roadmap = await Roadmap.findOne({ goalId }).populate('goalId');

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found for this goal' });
    }

    let userProgress = {
      completedStages: [],
      completedTopics: [],
    };

    if (req.user) {
      const userGoal = await UserGoal.findOne({ userId: req.user._id, goalId });
      if (userGoal) {
        userProgress = {
          completedStages: userGoal.completedStages || [],
          completedTopics: userGoal.completedTopics || [],
          overallProgress: userGoal.overallProgress || 0,
        };
      }
    }

    // Fetch matching mentors/experts for this goal
    const mentors = await ExpertProfile.find({
      $or: [
        { targetGoals: goalId },
        { isAvailable: true }
      ]
    }).limit(6);

    res.json({
      success: true,
      data: {
        roadmap,
        goal: roadmap.goalId,
        userProgress,
        mentors
      }
    });
  } catch (err) {
    next(err);
  }
};

export const toggleTopicCompletion = async (req, res, next) => {
  try {
    const { goalId, stageNumber, topicTitle } = req.body;
    const userId = req.user._id;

    const userGoal = await UserGoal.findOne({ userId, goalId });
    if (!userGoal) {
      return res.status(404).json({ success: false, message: 'Goal enrollment not found' });
    }

    const topicKey = `${stageNumber}:${topicTitle}`;
    const existsIndex = userGoal.completedTopics.indexOf(topicKey);

    if (existsIndex > -1) {
      userGoal.completedTopics.splice(existsIndex, 1);
    } else {
      userGoal.completedTopics.push(topicKey);
    }

    // Check if whole stage is completed
    const roadmap = await Roadmap.findOne({ goalId });
    const stage = roadmap.stages.find(s => s.stageNumber === stageNumber);

    if (stage) {
      const stageTopics = stage.topics.map(t => `${stageNumber}:${t.title}`);
      const allStageTopicsDone = stageTopics.every(t => userGoal.completedTopics.includes(t));

      if (allStageTopicsDone && !userGoal.completedStages.includes(stageNumber)) {
        userGoal.completedStages.push(stageNumber);
      } else if (!allStageTopicsDone && userGoal.completedStages.includes(stageNumber)) {
        userGoal.completedStages = userGoal.completedStages.filter(s => s !== stageNumber);
      }
    }

    await userGoal.save();

    res.json({
      success: true,
      data: {
        completedTopics: userGoal.completedTopics,
        completedStages: userGoal.completedStages,
      },
      message: 'Topic status updated'
    });
  } catch (err) {
    next(err);
  }
};
