import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getStudentBookings,
  cancelStudentBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getStudentBookings);
router.patch('/:id/cancel', protect, cancelStudentBooking);

export default router;
