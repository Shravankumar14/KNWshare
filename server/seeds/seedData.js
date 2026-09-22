import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Roadmap from '../models/Roadmap.js';
import Resource from '../models/Resource.js';
import ExpertProfile from '../models/ExpertProfile.js';
import UserGoal from '../models/UserGoal.js';
import Task from '../models/Task.js';
import Timetable from '../models/Timetable.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database population...');

    // Clear existing collections
    await Promise.all([
      Goal.deleteMany({}),
      Roadmap.deleteMany({}),
      Resource.deleteMany({}),
      ExpertProfile.deleteMany({}),
    ]);

    // Read JSON goal data
    const dataDir = path.join(__dirname, '../data/goals');
    const jeeJsonPath = path.join(dataDir, 'jee-mains-advanced.json');
    const fsJsonPath = path.join(dataDir, 'full-stack-development.json');

    const jeeData = JSON.parse(fs.readFileSync(jeeJsonPath, 'utf8'));
    const fullStackData = JSON.parse(fs.readFileSync(fsJsonPath, 'utf8'));

    // 1. CREATE GOALS (JEE Mains & Advanced as primary)
    const jeeGoal = await Goal.create(jeeData.goal);
    const fullStackGoal = await Goal.create(fullStackData.goal);

    const mlGoal = await Goal.create({
      title: 'Machine Learning & AI',
      slug: 'machine-learning-ai',
      category: 'ai_ml',
      tagline: 'From mathematical foundations and data analysis to Deep Learning and LLM applications',
      description: 'Comprehensive curriculum covering Linear Algebra, Statistics, Scikit-Learn, PyTorch, Neural Networks, and Generative AI.',
      icon: 'Brain',
      badgeColor: 'purple',
      estimatedMonths: 8,
      targetRoles: [
        'Machine Learning Engineer',
        'AI Research Engineer',
        'Data Scientist',
        'LLM / NLP Specialist'
      ],
      careerPath: [
        {
          stepNumber: 1,
          title: 'Mathematical & Python Foundations',
          subtitle: 'Linear Algebra, Calculus, Probability, NumPy & Pandas',
          description: 'Acquire mathematical intuitions behind cost functions, vector projections, and gradient descent.',
          milestones: ['Matrix operations with NumPy', 'Data wrangling with Pandas', 'Exploratory data analysis on Kaggle datasets'],
          icon: 'Calculator'
        },
        {
          stepNumber: 2,
          title: 'Classical Machine Learning',
          subtitle: 'Supervised, Unsupervised & Ensemble Models',
          description: 'Implement regression, classification, trees, random forests, and SVMs with Scikit-Learn.',
          milestones: ['Build end-to-end ML classification pipeline', 'Feature engineering and hyperparameter tuning'],
          icon: 'Cpu'
        }
      ]
    });

    const cpGoal = await Goal.create({
      title: 'Competitive Programming & DSA',
      slug: 'competitive-programming-dsa',
      category: 'competitive_programming',
      tagline: 'Algorithmic problem solving, contest ratings, and Big Tech interview mastery',
      description: 'Systematic progression from arrays, recursion, and sorting to dynamic programming, trees, graphs, and segment trees.',
      icon: 'Terminal',
      badgeColor: 'amber',
      estimatedMonths: 6,
      targetRoles: [
        'FAANG / Tier-1 Software Engineer',
        'Codeforces Candidate Master / Knight',
        'ICPC Regional Contestant'
      ],
      careerPath: [
        {
          stepNumber: 1,
          title: 'Core DSA & STL / Collections',
          subtitle: 'Complexity Analysis, Two Pointers, Binary Search',
          description: 'Time and space complexity intuitions, hash maps, heaps, and standard library collections.',
          milestones: ['Solve 50 easy LeetCode problems', 'Comfortable with fast I/O and Big-O analysis'],
          icon: 'Code'
        }
      ]
    });

    console.log('[Seed] Goals created successfully.');

    // 2. CREATE ROADMAPS (Both JEE and Full Stack)
    await Roadmap.create({
      goalId: jeeGoal._id,
      title: jeeData.roadmap.title,
      totalEstimatedHours: jeeData.roadmap.totalEstimatedHours,
      stages: jeeData.roadmap.stages
    });

    await Roadmap.create({
      goalId: fullStackGoal._id,
      title: fullStackData.roadmap.title,
      totalEstimatedHours: fullStackData.roadmap.totalEstimatedHours,
      stages: fullStackData.roadmap.stages
    });

    console.log('[Seed] Roadmaps created for JEE and Full Stack.');

    // 3. CREATE RESOURCES
    const jeeResourcesToInsert = jeeData.resources.map(r => ({
      ...r,
      goalId: jeeGoal._id
    }));

    const fsResourcesToInsert = fullStackData.resources.map(r => ({
      ...r,
      goalId: fullStackGoal._id
    }));

    await Resource.insertMany([...jeeResourcesToInsert, ...fsResourcesToInsert]);
    console.log(`[Seed] ${jeeResourcesToInsert.length + fsResourcesToInsert.length} curated resources inserted.`);

    // 4. CREATE EXPERT PROFILES / MENTORS (Goal-Specific)
    const jeeMentorsToInsert = jeeData.mentors.map(m => {
      const { _id, ...rest } = m;
      return {
        ...rest,
        targetGoals: [jeeGoal._id]
      };
    });

    const fsMentorsToInsert = fullStackData.mentors.map(m => {
      const { _id, ...rest } = m;
      return {
        ...rest,
        targetGoals: [fullStackGoal._id]
      };
    });

    await ExpertProfile.insertMany([...jeeMentorsToInsert, ...fsMentorsToInsert]);
    console.log('[Seed] Goal-specific verified mentors created.');

    // 5. DEMO USER INITIALIZATION (Enrolled in JEE as primary)
    let student = await User.findOne({ email: 'student@knwshare.dev' });
    if (!student) {
      student = await User.create({
        name: 'Alex Rivera',
        email: 'student@knwshare.dev',
        password: 'password123',
        role: 'student',
        bio: 'Dedicated student targeting All India Rank in JEE Mains & Advanced with structured PCM discipline.',
      });
    }

    // Clear old user goals for demo student
    await UserGoal.deleteMany({ userId: student._id });

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 12);

    const demoJeeUserGoal = await UserGoal.create({
      userId: student._id,
      goalId: jeeGoal._id,
      currentLevel: 'beginner',
      targetDate,
      hoursPerDay: 3,
      hoursPerWeek: 21,
      status: 'active',
      completedStages: [1],
      completedTopics: [
        '1:Units, Dimensions, Errors & Practical Physics',
        '1:Vectors & Kinematics (1D, 2D & Relative Motion)'
      ],
      overallProgress: 10
    });

    // Also enroll in Full Stack as inactive/secondary goal so user can switch between them
    const demoFsUserGoal = await UserGoal.create({
      userId: student._id,
      goalId: fullStackGoal._id,
      currentLevel: 'beginner',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      hoursPerDay: 2,
      hoursPerWeek: 14,
      status: 'inactive',
      completedStages: [],
      completedTopics: [],
      overallProgress: 0
    });

    student.activeGoal = demoJeeUserGoal._id;
    await student.save();

    // 6. INITIAL SAMPLE TASKS FOR JEE
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Task.deleteMany({ userId: student._id });

    await Task.create([
      {
        userId: student._id,
        userGoalId: demoJeeUserGoal._id,
        goalId: jeeGoal._id,
        stageNumber: 1,
        topicTitle: 'Newton\'s Laws of Motion, Constraints & Friction',
        title: 'Study: NLM Free Body Diagrams & Friction',
        description: 'Watch Physics Galaxy illustrations on block-on-block friction and solve 15 standard pulley constraint problems.',
        date: todayStr,
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        durationMinutes: 90,
        priority: 'high',
        status: 'pending',
        originalDate: todayStr
      },
      {
        userId: student._id,
        userGoalId: demoJeeUserGoal._id,
        goalId: jeeGoal._id,
        stageNumber: 4,
        topicTitle: 'Some Basic Concepts of Chemistry (Mole Concept & Stoichiometry)',
        title: 'Chemistry: NCERT Mole Concept & Redox Balancing',
        description: 'Read NCERT Class 11 Chapter 1, derive limiting reagent problems, and practice balancing redox equations.',
        date: todayStr,
        startTime: '11:00 AM',
        endTime: '12:30 PM',
        durationMinutes: 90,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        originalDate: todayStr
      },
      {
        userId: student._id,
        userGoalId: demoJeeUserGoal._id,
        goalId: jeeGoal._id,
        stageNumber: 7,
        topicTitle: 'Complex Numbers & Quadratic Equations',
        title: 'Math: Quadratic Equations Chapterwise PYQs',
        description: 'Solve 20 recent JEE Main and Advanced questions on symmetric roots and location of roots using MathonGo pack.',
        date: tomorrowStr,
        startTime: '02:00 PM',
        endTime: '03:30 PM',
        durationMinutes: 90,
        priority: 'medium',
        status: 'pending',
        originalDate: tomorrowStr
      }
    ]);

    console.log('[Seed] Database successfully populated with JEE and Full Stack curricula, roadmaps, resources, and tasks!');
    return true;
  } catch (err) {
    console.error('[Seed] Error populating database:', err);
    throw err;
  }
};

// Allow running directly via "node seedData.js"
if (process.argv[1]?.endsWith('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  })();
}
