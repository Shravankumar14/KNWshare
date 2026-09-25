import express from 'express';
import { register, login, getMe, googleAuth } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gmail format validation middleware
export const validateGmail = (req, res, next) => {
  const { email } = req.body;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email || !gmailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }
  next();
};

router.post('/register', register);
router.post('/login', validateGmail, login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

export default router;
