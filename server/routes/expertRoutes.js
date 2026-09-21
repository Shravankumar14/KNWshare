import express from 'express';
import { getAllExperts, getExpertById, bookSlot, getMyBookings } from '../controllers/expertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllExperts);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', getExpertById);
router.post('/book', protect, bookSlot);

export default router;
