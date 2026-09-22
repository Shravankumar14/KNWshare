import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getPublicStories,
  getMyStories,
  createStory,
  deleteStory,
} from '../controllers/storyController.js';

const router = express.Router();

// Public student-facing stories
router.get('/', getPublicStories);

// Teacher-protected management
router.get(['/my', '/my/all'], protect, authorize('teacher', 'admin'), getMyStories);
router.post('/', protect, authorize('teacher', 'admin'), createStory);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteStory);

export default router;
