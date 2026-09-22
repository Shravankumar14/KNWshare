import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

import {
  getActiveGoals,
  getGoalRoadmap,
  getStageDetail,
  getFilteredResources,
  getResourceById,
  createTeacherResource,
  updateTeacherResource,
  deleteTeacherResource,
  verifyResource,
  saveUserGoalProfile,
  getUserGoalProfile,
  getPersonalizedRoadmap,
  updateTopicProgress,
} from '../controllers/multiGoalRoadmapController.js';

import {
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getTeacherPublicProfile
} from '../controllers/teacherController.js';

const router = express.Router();

// Helper for optional auth on public/filter endpoints
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // ignore
    }
  }
  next();
};

// ==========================================
// GOALS & ROADMAPS
// ==========================================
router.get('/goals', getActiveGoals);
router.get('/goals/:goalSlug/roadmap', getGoalRoadmap);
router.get('/roadmaps/:roadmapId/stages/:stageId', getStageDetail);

// ==========================================
// RESOURCES
// ==========================================
router.get('/resources', optionalAuth, getFilteredResources);
router.get('/resources/:id', optionalAuth, getResourceById);
router.post('/resources', protect, authorize('teacher', 'admin'), createTeacherResource);
router.put('/resources/:id', protect, authorize('teacher', 'admin'), updateTeacherResource);
router.delete('/resources/:id', protect, authorize('teacher', 'admin'), deleteTeacherResource);
router.patch('/resources/:id/verify', protect, authorize('admin'), verifyResource);

// ==========================================
// PERSONALIZATION & PROGRESS
// ==========================================
router.post('/users/me/goal-profile', protect, saveUserGoalProfile);
router.get('/users/me/goal-profile/:goalSlug', protect, getUserGoalProfile);
router.get('/users/me/roadmap/:goalSlug', protect, getPersonalizedRoadmap);
router.patch('/users/me/progress/:topicId', protect, updateTopicProgress);

// ==========================================
// TEACHER PROFILE EXTENSIONS
// ==========================================
router.post('/teachers/me/achievements', protect, authorize('teacher', 'admin'), addAchievement);
router.put('/teachers/me/achievements/:id', protect, authorize('teacher', 'admin'), updateAchievement);
router.delete('/teachers/me/achievements/:id', protect, authorize('teacher', 'admin'), deleteAchievement);

router.post('/teachers/me/work-experience', protect, authorize('teacher', 'admin'), addWorkExperience);
router.put('/teachers/me/work-experience/:id', protect, authorize('teacher', 'admin'), updateWorkExperience);
router.delete('/teachers/me/work-experience/:id', protect, authorize('teacher', 'admin'), deleteWorkExperience);

router.get('/teachers/:id/public-profile', getTeacherPublicProfile);

export default router;
