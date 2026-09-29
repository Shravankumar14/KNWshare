import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import UserGoal from '../models/UserGoal.js';
import { handleAiChat } from '../controllers/aiChatController.js';
import { sanitizeAiContext } from '../services/ai/sanitizeAiContext.js';

function mockReqRes(body, user) {
  const req = { body, user };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    }
  };

  const next = (err) => {
    statusCode = 500;
    responseData = { error: err?.message || err };
  };

  return { req, res, getStatus: () => statusCode, getData: () => responseData, next };
}

async function testPhase4() {
  console.log('[Test Phase 4] Testing Gemini backend service and /api/ai/chat security boundary...');
  try {
    await connectDB();

    // 1. Verify sanitizeAiContext denylist/whitelist enforcement
    const unsafeUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Student',
      email: 'test@knwshare.dev',
      password: '$2a$10$unhashedSensitivePasswordHashHere',
      role: 'student',
      jwtToken: 'sensitive.jwt.token.here',
      secretKey: 'my_super_secret_key'
    };

    const sanitized = sanitizeAiContext({
      user: unsafeUser,
      activeGoal: { title: 'JEE Main & Advanced', slug: 'jee-main-advanced', internalSecret: 'hide_me' }
    });

    console.log('[Test Phase 4] Sanitized Context:', sanitized);

    const jsonStr = JSON.stringify(sanitized);
    if (jsonStr.includes('password') || jsonStr.includes('token') || jsonStr.includes('secret') || jsonStr.includes('hide_me')) {
      throw new Error('Security Leak! Sanitizer leaked confidential fields.');
    }
    console.log('✅ Context whitelist sanitizer verified: Zero credentials leaked.');

    // 2. Test handleAiChat with student
    const student = await User.create({
      name: 'Priya Sharma',
      email: `student_ai_${Date.now()}@knwshare.dev`,
      password: 'password123',
      role: 'student'
    });

    const m = mockReqRes({ message: 'How do I start preparing for JEE Physics?' }, student);
    await handleAiChat(m.req, m.res, m.next);

    const status = m.getStatus();
    const data = m.getData();

    console.log(`[Test Phase 4] Chatbot Response Status: ${status}`);
    console.log(`[Test Phase 4] Chatbot Reply Sample: ${data?.data?.reply?.slice(0, 100)}...`);

    if (status !== 200 || !data?.success || !data?.data?.reply) {
      throw new Error(`Chat request failed with status ${status}: ${JSON.stringify(data)}`);
    }

    // Verify response does not leak GEMINI_API_KEY
    const respStr = JSON.stringify(data);
    if (process.env.GEMINI_API_KEY && respStr.includes(process.env.GEMINI_API_KEY)) {
      throw new Error('Critical Security Failure: GEMINI_API_KEY leaked in response!');
    }

    console.log('✅ Gate Test 4 Passed: AI Chat response returned successfully, zero secret leakage, safe fallback active.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gate Test 4 Failed:', err.message);
    await disconnectDB();
    process.exit(1);
  }
}

testPhase4();
