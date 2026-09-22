import express from 'express';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { handleAiChat } from '../controllers/aiChatController.js';

const router = express.Router();

// POST /api/ai/chat (or /api/v1/ai/chat) — Enriched with student context if authenticated
router.post('/chat', optionalAuth, handleAiChat);

export default router;
