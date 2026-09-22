import { chatService } from '../services/ai/chatService.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, history, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message string is required' });
    }

    // Safe contextual payload (never include private user credentials)
    const safeContext = {
      activeGoal: context?.activeGoal?.title || 'JEE Mains & Advanced Preparation',
      goalSlug: context?.activeGoal?.slug || 'jee-mains-advanced',
      level: context?.level || 'student'
    };

    const reply = await chatService.generateResponse(message, history || [], safeContext);

    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};
