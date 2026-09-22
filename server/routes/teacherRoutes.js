import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getMyTeacherProfile,
  updateMyTeacherProfile,
  getMyAvailabilitySlots,
  addAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  getTeacherBookings,
  updateBookingStatus,
  getMyTeacherContent,
  createTeacherContent,
  updateTeacherContent,
  deleteTeacherContent,
  getPublicTeacherContent,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getPublicTeachers,
  getTeacherPublicSlots
} from '../controllers/teacherController.js';

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (Student Discovery)
// ==========================================
router.get('/public', getPublicTeachers);
router.get('/public/:teacherId/slots', getTeacherPublicSlots);
router.get('/content/public', getPublicTeacherContent);

// ==========================================
// PROTECTED TEACHER ROUTES
// ==========================================

// Profile (Supports both /profile and /profile/me, PUT & POST)
router.get(['/profile', '/profile/me'], protect, authorize('teacher', 'admin'), getMyTeacherProfile);
router.put(['/profile', '/profile/me'], protect, authorize('teacher', 'admin'), updateMyTeacherProfile);
router.post(['/profile', '/profile/me'], protect, authorize('teacher', 'admin'), updateMyTeacherProfile);

// Availability Slots (Supports both /slots and /availability)
router.get(['/slots', '/availability'], protect, authorize('teacher', 'admin'), getMyAvailabilitySlots);
router.post(['/slots', '/availability'], protect, authorize('teacher', 'admin'), addAvailabilitySlot);
router.put(['/slots/:id', '/availability/:id'], protect, authorize('teacher', 'admin'), updateAvailabilitySlot);
router.delete(['/slots/:id', '/availability/:id'], protect, authorize('teacher', 'admin'), deleteAvailabilitySlot);

// Student Bookings / Sessions
router.get('/bookings', protect, authorize('teacher', 'admin'), getTeacherBookings);
router.patch(['/bookings/:id', '/bookings/:id/status'], protect, authorize('teacher', 'admin'), updateBookingStatus);

// Teacher Content (Notes, PDFs, Videos, Documents)
router.get('/content/my', protect, authorize('teacher', 'admin'), getMyTeacherContent);
router.post('/content', protect, authorize('teacher', 'admin'), createTeacherContent);
router.put('/content/:id', protect, authorize('teacher', 'admin'), updateTeacherContent);
router.delete('/content/:id', protect, authorize('teacher', 'admin'), deleteTeacherContent);

// Achievements & Recognition
router.post('/achievements', protect, authorize('teacher', 'admin'), addAchievement);
router.put('/achievements/:id', protect, authorize('teacher', 'admin'), updateAchievement);
router.delete('/achievements/:id', protect, authorize('teacher', 'admin'), deleteAchievement);

// Professional Work Experience
router.post('/experience', protect, authorize('teacher', 'admin'), addWorkExperience);
router.put('/experience/:id', protect, authorize('teacher', 'admin'), updateWorkExperience);
router.delete('/experience/:id', protect, authorize('teacher', 'admin'), deleteWorkExperience);

export default router;
