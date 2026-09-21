import express from 'express';
import {
  getAllGoals,
  getGoalById,
  selectGoal,
  createCustomGoal,
  getMyGoals,
  switchActiveGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllGoals);
router.get('/my-goals', protect, getMyGoals);
router.get('/:id', getGoalById);
router.post('/select', protect, selectGoal);
router.post('/custom', protect, createCustomGoal);
router.post('/switch', protect, switchActiveGoal);

export default router;
