import express from 'express';
import { getProgressSummary } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getProgressSummary);

export default router;
