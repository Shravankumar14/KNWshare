import express from 'express';
import { generateTimetable, getCurrentTimetable, updateScheduleBlock } from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateTimetable);
router.get('/current', getCurrentTimetable);
router.put('/block', updateScheduleBlock);

export default router;
