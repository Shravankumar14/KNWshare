import express from 'express';
import { getResources, toggleSelectResource, createResource } from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // ignore
    }
  }
  next();
};

router.get('/', optionalAuth, getResources);
router.post('/toggle-select', protect, toggleSelectResource);
router.post('/', protect, authorize('admin', 'expert'), createResource);

export default router;
