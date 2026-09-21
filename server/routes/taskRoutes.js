import express from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  rescheduleTask,
  rescheduleAllPending
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/reschedule', rescheduleTask);
router.post('/reschedule-pending', rescheduleAllPending);

export default router;
