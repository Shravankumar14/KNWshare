import User from '../models/User.js';
import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import Task from '../models/Task.js';
import { geminiService } from '../services/geminiService.js';
import { sanitizeAiContext } from '../services/ai/sanitizeAiContext.js';

export const handleAiChat = async (req, res, next) => {
  try {
    const { message, history, conversationId } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message string is required' });
    }

    const userId = req.user?._id;
    let activeGoalDoc = null;
    let goalProfile = null;
    let userGoalDoc = null;
    let pendingTasks = [];

    if (userId) {
      // 1. Fetch user's active goal
      const user = await User.findById(userId).populate('activeGoal');
      if (user?.activeGoal) {
        userGoalDoc = await UserGoal.findById(user.activeGoal).populate('goalId');
        activeGoalDoc = userGoalDoc?.goalId || null;
      }

      // If activeGoalDoc resolved, look up profile & tasks
      if (activeGoalDoc) {
        goalProfile = await UserGoalProfile.findOne({ userId, goalId: activeGoalDoc._id });
        pendingTasks = await Task.find({
          userId,
          status: 'pending'
        }).sort({ date: 1, startTime: 1 }).limit(5);
      }
    }

    // 2. Assemble safe whitelist context (no passwords, JWTs, or secrets)
    const safeContext = sanitizeAiContext({
      user: req.user,
      activeGoal: activeGoalDoc,
      goalProfile,
      progress: userGoalDoc,
      tasks: pendingTasks
    });

    // 3. Generate response via Gemini Service
    const reply = await geminiService.generateReply({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      safeContext
    });

    res.json({
      success: true,
      data: {
        reply,
        conversationId: conversationId || `conv-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('AI Chat Service Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'AI assistant is temporarily unavailable. Please try again.'
    });
  }
};
