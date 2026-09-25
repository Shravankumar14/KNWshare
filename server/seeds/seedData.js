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

    // Delete any stale demo users to ensure complete cleanup
    await User.deleteMany({ email: { $in: ['student@knwshare.dev', 'alex@knwshare.dev'] } });

    console.log('[Seed] Database successfully populated with JEE and Full Stack curricula, roadmaps, and resources!');
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
