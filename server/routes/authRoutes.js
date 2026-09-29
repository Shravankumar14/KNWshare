import express from 'express';
import { register, login, getMe, googleAuth, demoLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gmail format validation helper
export const validateGmail = (req, res, next) => {
  const { email } = req.body;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email || !gmailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }
  next();
};

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;
