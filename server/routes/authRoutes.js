import express from 'express';
import { register, login, getMe, demoLogin, demoTeacherLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/demo-teacher-login', demoTeacherLogin);
router.get('/me', protect, getMe);

export default router;
