import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getPublicPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

// Public student-facing feed
router.get('/', getPublicPosts);
router.get('/:id', getPostById);

// Teacher-protected management
router.get(['/my', '/my/all'], protect, authorize('teacher', 'admin'), getMyPosts);
router.post('/', protect, authorize('teacher', 'admin'), createPost);
router.patch('/:id', protect, authorize('teacher', 'admin'), updatePost);
router.put('/:id', protect, authorize('teacher', 'admin'), updatePost);
router.delete('/:id', protect, authorize('teacher', 'admin'), deletePost);

export default router;
