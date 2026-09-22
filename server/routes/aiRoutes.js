import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { handleAiChat } from '../controllers/aiChatController.js';

const router = express.Router();

// POST /api/ai/chat (or /api/v1/ai/chat) — Auth required per architecture §3.1
router.post('/chat', protect, handleAiChat);

export default router;
