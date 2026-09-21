import Resource from '../models/Resource.js';
import UserGoal from '../models/UserGoal.js';

export const getResources = async (req, res, next) => {
  try {
    const { goalId, stageNumber, topicTitle, type, difficulty, search } = req.query;

    const filter = {};
    if (goalId) filter.goalId = goalId;
    if (stageNumber) filter.stageNumber = Number(stageNumber);
    if (topicTitle) filter.topicTitle = new RegExp(topicTitle, 'i');
    if (type && type !== 'all') filter.type = type;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { topicTitle: new RegExp(search, 'i') },
        { provider: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const resources = await Resource.find(filter).sort({ rating: -1, createdAt: -1 });

    // Fetch user bookmarks / selected resources if user is authenticated
    let userSelectedIds = [];
    if (req.user && goalId) {
      const userGoal = await UserGoal.findOne({ userId: req.user._id, goalId });
      if (userGoal) {
        userSelectedIds = (userGoal.selectedResources || []).map(id => id.toString());
      }
    }

    res.json({
      success: true,
      count: resources.length,
      data: resources,
      userSelectedIds
    });
  } catch (err) {
    next(err);
  }
};

export const toggleSelectResource = async (req, res, next) => {
  try {
    const { resourceId, goalId } = req.body;
    const userId = req.user._id;

    const userGoal = await UserGoal.findOne({ userId, goalId });
    if (!userGoal) {
      return res.status(404).json({ success: false, message: 'Goal enrollment not found' });
    }

    const idStr = resourceId.toString();
    const index = userGoal.selectedResources.findIndex(r => r.toString() === idStr);

    if (index > -1) {
      userGoal.selectedResources.splice(index, 1);
    } else {
      userGoal.selectedResources.push(resourceId);
    }

    await userGoal.save();

    res.json({
      success: true,
      data: userGoal.selectedResources,
      message: index > -1 ? 'Resource removed from your learning plan' : 'Resource added to your learning plan'
    });
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};
