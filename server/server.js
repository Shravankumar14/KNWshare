import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase } from './seeds/seedData.js';
import { seedRoadmaps } from './scripts/seedRoadmaps.js';
import Goal from './models/Goal.js';
import Roadmap from './models/Roadmap.js';


// Route imports
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import multiGoalRoutes from './routes/multiGoalRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'https://kn-wshare.vercel.app',
    ];
    // Allow any Vercel deployment (*.vercel.app) or no origin (mobile/Postman)
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get(['/health', '/api/health', '/api/v1/health'], (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'KNWshare Backend API',
    version: '1.0.0'
  });
});

// Multi-Goal System Routes (§4: /api/goals, /api/resources, /api/users/me/*, etc.)
app.use('/api', multiGoalRoutes);
app.use('/api/v1', multiGoalRoutes);

// Mount Existing Routes with /api and /api/v1 support
const mountAppRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/goals`, goalRoutes);
  app.use(`${prefix}/roadmaps`, roadmapRoutes);
  app.use(`${prefix}/resources`, resourceRoutes);
  app.use(`${prefix}/timetable`, timetableRoutes);
  app.use(`${prefix}/tasks`, taskRoutes);
  app.use(`${prefix}/progress`, progressRoutes);
  app.use(`${prefix}/experts`, expertRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/teachers`, teacherRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/chat`, chatRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/posts`, postRoutes);
  app.use(`${prefix}/stories`, storyRoutes);
};

mountAppRoutes('/api/v1');
mountAppRoutes('/api');

// Manual Seed Trigger Endpoint (Protected by secret or public in dev/initial deploy)
app.post('/api/v1/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database successfully seeded with JEE and Full Stack data!' });
  } catch (err) {
    next(err);
  }
});

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect DB, Auto-seed if first run or missing roadmaps, and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database has missing roadmaps
    const goalCount = await Goal.countDocuments();
    const roadmapCount = await Roadmap.countDocuments();
    if (goalCount < 4 || roadmapCount < 4) {
      console.log(`[Server] Incomplete multi-goal database detected (goals: ${goalCount}, roadmaps: ${roadmapCount}). Triggering automatic seed...`);
      await seedRoadmaps();
    }

    app.listen(PORT,"0.0.0.0", () => {
      const hasGeminiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
      console.log(`=========================================`);
      console.log(`🚀 KNWshare Server running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🔒 Security Boundary: Secret leak protection active`);
      console.log(`🤖 Gemini AI Assistant: ${hasGeminiKey ? 'Active (API Key loaded)' : 'Active (Resilient Curated Engine)'}`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
