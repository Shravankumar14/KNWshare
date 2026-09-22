import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getMyTeacherProfile,
  updateMyTeacherProfile,
  getMyAvailabilitySlots,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  getTeacherBookings,
  updateBookingStatus,
  getPublicTeachers,
  getTeacherPublicSlots
} from '../controllers/teacherController.js';

const router = express.Router();

// Public teacher discovery
router.get('/public', getPublicTeachers);
router.get('/public/:teacherId/slots', getTeacherPublicSlots);

// Protected teacher dashboard routes
router.get('/profile', protect, authorize('teacher', 'admin'), getMyTeacherProfile);
router.put('/profile', protect, authorize('teacher', 'admin'), updateMyTeacherProfile);

router.get('/availability', protect, authorize('teacher', 'admin'), getMyAvailabilitySlots);
router.post('/availability', protect, authorize('teacher', 'admin'), addAvailabilitySlot);
router.delete('/availability/:id', protect, authorize('teacher', 'admin'), deleteAvailabilitySlot);

router.get('/bookings', protect, authorize('teacher', 'admin'), getTeacherBookings);
router.patch('/bookings/:id/status', protect, authorize('teacher', 'admin'), updateBookingStatus);

export default router;
