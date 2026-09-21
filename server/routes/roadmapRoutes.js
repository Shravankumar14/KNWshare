import express from 'express';
import { getRoadmapByGoal, toggleTopicCompletion } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

const router = express.Router();

// Optional auth helper to check if token exists without throwing 401
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // ignore expired/invalid token for optional routes
    }
  }
  next();
};

router.get('/:goalId', optionalAuth, getRoadmapByGoal);
router.post('/toggle-topic', protect, toggleTopicCompletion);

export default router;
