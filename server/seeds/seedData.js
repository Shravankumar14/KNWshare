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

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database population...');

    // Clear existing data
    await Promise.all([
      Goal.deleteMany({}),
      Roadmap.deleteMany({}),
      Resource.deleteMany({}),
      ExpertProfile.deleteMany({}),
    ]);

    // 1. CREATE GOALS
    const fullStackGoal = await Goal.create({
      title: 'Full Stack Development',
      slug: 'full-stack-development',
      category: 'web_dev',
      tagline: 'Master modern frontend, scalable backend architectures, and production deployment',
      description: 'From JavaScript basics to architecting full-scale web applications, cloud hosting, and cracking software engineering technical interviews.',
      icon: 'Layers',
      badgeColor: 'blue',
      estimatedMonths: 6,
      targetRoles: [
        'Full Stack Engineer',
        'Frontend React Developer',
        'Backend Node.js Developer',
        'Software Development Engineer (SDE)'
      ],
      careerPath: [
        {
          stepNumber: 1,
          title: 'Current Level: Beginner Foundations',
          subtitle: 'Web Fundamentals & Programming Mindset',
          description: 'Build core literacy in HTML semantic structure, CSS modern layout models (Flexbox/Grid), and JavaScript core execution context.',
          milestones: ['Build 3 static responsive landing pages', 'Write clean ES6+ JavaScript code', 'Understand DOM manipulation and event loop'],
          icon: 'Compass'
        },
        {
          stepNumber: 2,
          title: 'Interactive Frontend Mastery',
          subtitle: 'React Ecosystem & State Management',
          description: 'Build reactive user interfaces, custom hooks, component hierarchies, and clean client-side routing.',
          milestones: ['Create multi-page React SPA with Vite', 'Integrate REST APIs with Axios/TanStack Query', 'Implement client-side state handling'],
          icon: 'Code'
        },
        {
          stepNumber: 3,
          title: 'Robust Backend & Persistence',
          subtitle: 'Node.js, Express & MongoDB Database',
          description: 'Design RESTful APIs, relational/document schemas, JWT authorization, and middleware pipelines.',
          milestones: ['Build CRUD API with Express & Mongoose', 'Implement secure bcrypt + JWT auth', 'Implement validation and error handling'],
          icon: 'Database'
        },
        {
          stepNumber: 4,
          title: 'Full-Stack Portfolio Projects',
          subtitle: 'Production Applications & System Architecture',
          description: 'Assemble end-to-end full stack applications with real-time features, secure payments or notifications.',
          milestones: ['Deploy 2 complete capstone projects', 'Write comprehensive README documentation', 'Maintain clean Git commit history on GitHub'],
          icon: 'FolderGit2'
        },
        {
          stepNumber: 5,
          title: 'Internships & Production Readiness',
          subtitle: 'CI/CD, Cloud Deployment & Code Reviews',
          description: 'Deploy to Vercel/Render/AWS, configure environment security, automate builds, and collaborate on real codebases.',
          milestones: ['Contribute to open-source repository', 'Set up automated GitHub Actions workflow', 'Apply for SDE internship roles'],
          icon: 'Briefcase'
        },
        {
          stepNumber: 6,
          title: 'Technical Interview Preparation',
          subtitle: 'Data Structures, System Design & Behavioral',
          description: 'Solve 100+ LeetCode problems (Arrays, Hashmaps, Trees), practice system design fundamentals, and mock interviews.',
          milestones: ['Master top 75 interview coding patterns', 'Conduct 3 mock technical interviews', 'Target Career: SDE-1 at tech companies'],
          icon: 'Award'
        }
      ]
    });

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
          milestones: ['Build end-to-end ML classification pipeline', 'Feature engineering and hyperparameter tuning', 'Top 25% Kaggle competition submission'],
          icon: 'Cpu'
        },
        {
          stepNumber: 3,
          title: 'Deep Learning & Neural Networks',
          subtitle: 'PyTorch, CNNs, RNNs & Transformers',
          description: 'Design deep neural networks, loss backpropagation, vision architectures, and attention mechanisms.',
          milestones: ['Train custom CNN image classifier in PyTorch', 'Implement Attention mechanism from scratch', 'Fine-tune pre-trained vision models'],
          icon: 'Zap'
        },
        {
          stepNumber: 4,
          title: 'Generative AI & LLM Systems',
          subtitle: 'HuggingFace, Prompt Engineering, RAG & Vector DBs',
          description: 'Leverage modern open-source LLMs, fine-tuning techniques (LoRA), and Retrieval-Augmented Generation.',
          milestones: ['Build multi-document RAG question answering system', 'Deploy quantized model with vLLM / HuggingFace', 'Target Career: Applied AI / ML Engineer'],
          icon: 'Sparkles'
        }
      ]
    });

    const jeeGoal = await Goal.create({
      title: 'JEE Mains & Advanced Preparation',
      slug: 'jee-mains-advanced',
      category: 'engineering_exams',
      tagline: 'Strategic master plan for Physics, Chemistry, and Mathematics mastery',
      description: 'Rigorous conceptual clarity, problem-solving speed drills, formula mastery, and mock exam discipline for premier engineering admissions.',
      icon: 'Target',
      badgeColor: 'emerald',
      estimatedMonths: 12,
      targetRoles: [
        'Top 1% All India Rank in JEE',
        'Admissions to IITs / NITs / BITS',
        'B.Tech in Computer Science / Electrical'
      ],
      careerPath: [
        {
          stepNumber: 1,
          title: 'Core Concepts & NCERT Mastery',
          subtitle: 'Class 11 & 12 Foundation Chapters',
          description: 'Complete syllabus coverage across Mechanics, Thermodynamics, Organic Chemistry, and Calculus.',
          milestones: ['Complete all NCERT textbook problems', 'Create structured formula memory sheets', 'Chapter-wise test scores > 75%'],
          icon: 'BookOpen'
        },
        {
          stepNumber: 2,
          title: 'Advanced Problem Solving',
          subtitle: 'Previous 10 Years Papers & Multi-Concept Questions',
          description: 'Train speed and accuracy solving tricky multi-topic physics and coordinate geometry problems.',
          milestones: ['Solve 1,500+ standard problems', 'Master time-saving shortcuts and dimensional elimination', 'Sectional mock tests'],
          icon: 'Activity'
        },
        {
          stepNumber: 3,
          title: 'Exam Simulation & Rank Acceleration',
          subtitle: 'Full 3-Hour Computer Based Tests',
          description: 'Condition your stamina and eliminate negative marking under real exam timing conditions.',
          milestones: ['Complete 30 full-length mock exams', 'Analyze error notebook weekly', 'Target: 99+ percentile in JEE'],
          icon: 'Award'
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
          milestones: ['Solve 50 easy LeetCode problems', 'Comfortable with fast I/O and Big-O analysis', 'Participate in first live contest'],
          icon: 'Code'
        },
        {
          stepNumber: 2,
          title: 'Non-Linear Structures & Recursion',
          subtitle: 'Trees, Graphs, BFS/DFS, Backtracking',
          description: 'Binary trees, binary search trees, topological sort, Dijkstra, and recursive formulations.',
          milestones: ['Solve 80 medium problems on Graphs & Trees', 'Achieve 1500+ rating on Codeforces/CodeChef'],
          icon: 'GitBranch'
        },
        {
          stepNumber: 3,
          title: 'Dynamic Programming & Advanced Algorithms',
          subtitle: '1D/2D DP, Bitmasking, Disjoint Set Union',
          description: 'Subproblem overlap, memoization, bottom-up transitions, and knapsack variations.',
          milestones: ['Solve 60 DP problems', 'Master top 20 interview graph algorithms', 'Ready for Google / Amazon coding loops'],
          icon: 'Award'
        }
      ]
    });

    const gateGoal = await Goal.create({
      title: 'GATE CS & IT Examination',
      slug: 'gate-cs-it',
      category: 'engineering_exams',
      tagline: 'Comprehensive preparation for M.Tech admissions at IISc/IITs and PSU recruitment',
      description: 'Master Operating Systems, DBMS, Computer Networks, Theory of Computation, Algorithms, and Digital Logic.',
      icon: 'GraduationCap',
      badgeColor: 'teal',
      estimatedMonths: 10,
      targetRoles: [
        'M.Tech at IISc / IIT Bombay / IIT Delhi',
        'Scientist / Officer at ISRO, BARC, ONGC, IOCL',
        'Core Systems R&D Specialist'
      ],
      careerPath: [
        {
          stepNumber: 1,
          title: 'Core Theory & Mathematics',
          subtitle: 'Discrete Maths, Engineering Maths, TOC',
          description: 'Set theory, graphs, combinatorics, regular expressions, Turing machines.',
          milestones: ['Cover all Discrete Mathematics units', 'Standard GATE pyq sets', 'Score > 80% on subject tests'],
          icon: 'BookOpen'
        },
        {
          stepNumber: 2,
          title: 'Systems & Architecture',
          subtitle: 'OS, DBMS, Computer Architecture, Networks',
          description: 'Paging, virtual memory, SQL/Normalization, pipeline hazards, TCP/IP.',
          milestones: ['Solve 10 years of Systems PYQs', 'Review standard textbook questions (Galvin, Tanenbaum, Navathe)'],
          icon: 'Server'
        },
        {
          stepNumber: 3,
          title: 'Revision & National Mock Test Series',
          subtitle: 'Full-length Mock Exams & PYQ Drills',
          description: 'Speed, accuracy, and virtual calculator training for top 500 All-India rank.',
          milestones: ['Complete 25 national level test mocks', 'Revise short revision notes 5 times', 'Target: 70+ marks in GATE'],
          icon: 'Award'
        }
      ]
    });

    console.log('[Seed] Goals created successfully.');

    // 2. CREATE ROADMAPS (Detailed stages as requested)
    await Roadmap.create({
      goalId: fullStackGoal._id,
      title: 'Full Stack Developer Roadmap',
      totalEstimatedHours: 240,
      stages: [
        {
          stageNumber: 1,
          title: 'Stage 1: HTML & Modern CSS',
          shortSummary: 'Semantic structure, CSS Flexbox, CSS Grid, and responsive web design.',
          estimatedHours: 20,
          dependencies: [],
          topics: [
            {
              title: 'HTML5 Semantic Architecture',
              description: 'Semantic tags, accessibility (a11y), forms, SEO-friendly document hierarchy.',
              subtopics: ['Semantic markup', 'Forms & validations', 'Audio/video APIs', 'Accessibility (ARIA)'],
              skills: ['Semantic HTML', 'Accessibility', 'SEO Basics'],
              importance: 'high',
              estimatedHours: 8,
              practiceTasks: ['Build accessible survey form', 'Create multi-section semantic landing page']
            },
            {
              title: 'Modern CSS Layouts & Responsive Design',
              description: 'Flexbox, Grid systems, CSS variables, media queries, and mobile-first workflow.',
              subtopics: ['CSS Box Model', 'Flexbox deep-dive', 'CSS Grid 2D layouts', 'Media queries & viewport units'],
              skills: ['Responsive Design', 'Flexbox', 'CSS Grid', 'Tailwind basics'],
              importance: 'high',
              estimatedHours: 12,
              practiceTasks: ['Clone pricing page with CSS Grid', 'Build responsive navbar with hamburger toggle']
            }
          ],
          milestoneOutcome: 'Able to turn any Figma design into a responsive web page.'
        },
        {
          stageNumber: 2,
          title: 'Stage 2: JavaScript Mastery (ES6+)',
          shortSummary: 'Execution context, closures, asynchronous JS, DOM manipulation, and modern syntax.',
          estimatedHours: 35,
          dependencies: [1],
          topics: [
            {
              title: 'JS Engine Fundamentals & Scope',
              description: 'Call stack, execution context, hoisting, closures, and lexical environment.',
              subtopics: ['Primitive vs reference types', 'Closures & lexical scope', 'this keyword binding', 'Event loop & microtasks'],
              skills: ['JavaScript Core', 'Closures', 'Scope Chains'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Implement custom debounce and throttle functions', 'Build closure-based counter and cache']
            },
            {
              title: 'Asynchronous JavaScript & Fetch API',
              description: 'Promises, async/await, error handling, and fetching data from third-party APIs.',
              subtopics: ['Callbacks to Promises', 'async/await syntax', 'Promise.all / race / allSettled', 'Fetch API & JSON parsing'],
              skills: ['Async/Await', 'REST Consumption', 'Error Handling'],
              importance: 'high',
              estimatedHours: 20,
              practiceTasks: ['Build weather application consuming public API', 'Implement search autocomplete with debounce']
            }
          ],
          milestoneOutcome: 'Comfortable with vanilla JavaScript, modern ES6+ features, and async operations.'
        },
        {
          stageNumber: 3,
          title: 'Stage 3: React.js & Single Page Applications',
          shortSummary: 'Components, JSX, Hooks (useState, useEffect, useMemo, useRef), and React Router.',
          estimatedHours: 40,
          dependencies: [2],
          topics: [
            {
              title: 'React Components, Props & State',
              description: 'Declarative UI, component lifecycle, JSX compilation, and unidirectional data flow.',
              subtopics: ['Functional components', 'Props destructuring & children', 'useState hook', 'Lifting state up'],
              skills: ['React Fundamentals', 'State Architecture'],
              importance: 'high',
              estimatedHours: 18,
              practiceTasks: ['Build interactive task tracker with filters', 'Create accordion and modal component library']
            },
            {
              title: 'Advanced Hooks, Effects & React Router',
              description: 'Side effects with useEffect, dependency arrays, custom hooks, and dynamic client routing.',
              subtopics: ['useEffect deep-dive', 'useRef for DOM and timers', 'Custom hooks creation', 'React Router v6 navigation'],
              skills: ['React Hooks', 'Client-side Routing', 'Custom Hooks'],
              importance: 'high',
              estimatedHours: 22,
              practiceTasks: ['Build multi-page e-commerce storefront', 'Create custom useLocalStorage hook']
            }
          ],
          milestoneOutcome: 'Able to architect modern, reactive web frontends with clean component separation.'
        },
        {
          stageNumber: 4,
          title: 'Stage 4: Node.js Core & Runtime',
          shortSummary: 'V8 engine, Node module system, Event Loop, File System, and Streams.',
          estimatedHours: 25,
          dependencies: [2],
          topics: [
            {
              title: 'Node.js Architecture & Event-Driven I/O',
              description: 'Non-blocking I/O, libuv thread pool, events emitter, and module formats (ESM vs CJS).',
              subtopics: ['Event Loop phases', 'EventEmitter pattern', 'Buffer and File System (fs/promises)', 'Process and environment variables'],
              skills: ['Node.js Runtime', 'Event Loop', 'File System'],
              importance: 'high',
              estimatedHours: 12,
              practiceTasks: ['Build CLI file manager tool in Node.js', 'Create custom EventEmitter logger']
            },
            {
              title: 'HTTP Module & Creating Web Servers',
              description: 'Building raw HTTP servers, handling headers, request bodies, and status codes.',
              subtopics: ['http.createServer', 'Parsing query and JSON bodies', 'CORS headers', 'Streaming responses'],
              skills: ['HTTP Protocol', 'Server Fundamentals'],
              importance: 'medium',
              estimatedHours: 13,
              practiceTasks: ['Build raw HTTP server with GET/POST routes without Express']
            }
          ],
          milestoneOutcome: 'Understand how server runtimes execute code and handle concurrent connections.'
        },
        {
          stageNumber: 5,
          title: 'Stage 5: Express.js REST API Development',
          shortSummary: 'Routing, middleware chains, controller architecture, and input validation.',
          estimatedHours: 30,
          dependencies: [4],
          topics: [
            {
              title: 'Express Routing & Middleware Architecture',
              description: 'Application middleware, router middleware, third-party middleware (cors, morgan, helmet).',
              subtopics: ['Express Router pattern', 'Custom middleware creation', 'Error-handling middleware', 'Request validation'],
              skills: ['Express.js', 'Middleware Design', 'API Routing'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Create modular CRUD API with Express router', 'Implement global error handler and logger']
            },
            {
              title: 'RESTful Design Principles & Status Codes',
              description: 'Resource naming, HTTP verbs (GET, POST, PUT, PATCH, DELETE), idempotency, and status codes.',
              subtopics: ['REST standard specifications', 'HTTP status code best practices', 'Pagination and filtering', 'API versioning (/api/v1)'],
              skills: ['REST API Design', 'Data Pagination', 'Clean Architecture'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Design complete REST API specification for a blog platform']
            }
          ],
          milestoneOutcome: 'Capable of writing clean, production-grade REST APIs in Express.js.'
        },
        {
          stageNumber: 6,
          title: 'Stage 6: MongoDB & Mongoose ODM',
          shortSummary: 'NoSQL document design, schemas, indexes, relationships, and aggregation pipelines.',
          estimatedHours: 30,
          dependencies: [5],
          topics: [
            {
              title: 'MongoDB Schema Design & Validation',
              description: 'Mongoose models, schemas, data types, validators, pre/post middleware hooks.',
              subtopics: ['Document database modeling', 'Mongoose schema types', 'Embedded subdocuments vs references', 'Indexes and performance'],
              skills: ['MongoDB', 'Mongoose', 'Schema Design'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Design User, Post, and Comment schemas with referential integrity']
            },
            {
              title: 'Mongoose Queries & Aggregations',
              description: 'Populate, complex filters, update operators, and aggregation pipelines ($match, $group, $sort).',
              subtopics: ['CRUD with Mongoose', 'populate for joins', 'Atomic operators ($inc, $push)', 'Aggregation pipelines'],
              skills: ['Aggregation Pipelines', 'Query Optimization'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Write aggregation pipeline calculating monthly revenue by category']
            }
          ],
          milestoneOutcome: 'Confidently model real-world business data with high query efficiency.'
        },
        {
          stageNumber: 7,
          title: 'Stage 7: Authentication, Security & JWT',
          shortSummary: 'Password hashing with bcrypt, JWT token issuing, authorization middleware, and security practices.',
          estimatedHours: 20,
          dependencies: [5, 6],
          topics: [
            {
              title: 'Secure Authentication & JWT Tokens',
              description: 'Token payload, signature verification, token expiration, and secure HTTP cookies vs bearer headers.',
              subtopics: ['Bcrypt salt & hash', 'jwt.sign and jwt.verify', 'Protect middleware', 'Refresh token strategies'],
              skills: ['JWT', 'Bcrypt', 'Authentication'],
              importance: 'high',
              estimatedHours: 10,
              practiceTasks: ['Implement signup, login, and verifyToken workflow']
            },
            {
              title: 'Role-Based Access Control (RBAC) & API Security',
              description: 'Student vs Expert vs Admin roles, rate limiting, sanitization, and CORS protections.',
              subtopics: ['Role authorization middleware', 'Express rate limiting', 'Preventing NoSQL injection', 'CORS origin whitelisting'],
              skills: ['RBAC', 'Web Security', 'Defensive Programming'],
              importance: 'high',
              estimatedHours: 10,
              practiceTasks: ['Implement admin-only route guards and role checks']
            }
          ],
          milestoneOutcome: 'Build secure authentication workflows protecting private endpoints.'
        },
        {
          stageNumber: 8,
          title: 'Stage 8: Full-Stack Capstone Projects',
          shortSummary: 'Connecting React frontend with Express/MongoDB backend into complete applications.',
          estimatedHours: 40,
          dependencies: [3, 7],
          topics: [
            {
              title: 'End-to-End Application Integration',
              description: 'Axios interceptors, auth token persistence, optimistic UI updates, and error state handling.',
              subtopics: ['Global AuthContext', 'Axios request/response interceptors', 'Handling token expiry', 'Form validation (client + server)'],
              skills: ['Full-Stack Integration', 'State Management'],
              importance: 'high',
              estimatedHours: 20,
              practiceTasks: ['Connect React frontend with Express JWT auth', 'Implement full CRUD UI with instant feedback']
            },
            {
              title: 'Capstone: Product Development',
              description: 'Building a complete portfolio-ready application such as a collaborative planner, marketplace, or community.',
              subtopics: ['Feature prioritization', 'Responsive UI layout', 'Real-time or notification updates', 'Comprehensive documentation'],
              skills: ['Software Engineering', 'Project Architecture'],
              importance: 'high',
              estimatedHours: 20,
              practiceTasks: ['Complete and polish primary full-stack capstone project']
            }
          ],
          milestoneOutcome: 'Have a live, production-quality project to feature prominently on your resume.'
        },
        {
          stageNumber: 9,
          title: 'Stage 9: Deployment & DevOps Fundamentals',
          shortSummary: 'Vercel, Render, Railway, Docker basics, environment variables, and CI/CD.',
          estimatedHours: 15,
          dependencies: [8],
          topics: [
            {
              title: 'Production Deployment & Cloud Platforms',
              description: 'Configuring production builds, environment secrets, and continuous deployment.',
              subtopics: ['Vite production build optimization', 'Deploying Express to Render/Railway', 'Deploying React to Vercel/Netlify', 'Custom domains & SSL'],
              skills: ['Cloud Deployment', 'Environment Configuration', 'DevOps basics'],
              importance: 'high',
              estimatedHours: 8,
              practiceTasks: ['Deploy live full-stack app with production MongoDB Atlas cluster']
            },
            {
              title: 'CI/CD & Monitoring',
              description: 'GitHub Actions for linting and automated tests, error logging, and health check endpoints.',
              subtopics: ['GitHub Actions YAML', 'Health check route (/api/health)', 'Production error logs', 'Performance monitoring'],
              skills: ['GitHub Actions', 'CI/CD', 'App Monitoring'],
              importance: 'medium',
              estimatedHours: 7,
              practiceTasks: ['Set up GitHub action that runs linter and builds on pull request']
            }
          ],
          milestoneOutcome: 'Your application is live on the internet accessible to recruiters and users worldwide.'
        },
        {
          stageNumber: 10,
          title: 'Stage 10: Technical Interview Preparation & Career Launch',
          shortSummary: 'Data Structures, algorithmic problem solving, system design for juniors, and resume polish.',
          estimatedHours: 35,
          dependencies: [9],
          topics: [
            {
              title: 'Core DSA for Frontend & Full-Stack SDE Roles',
              description: 'Arrays, strings, recursion, hash maps, sliding window, and two-pointer interview patterns.',
              subtopics: ['Top 50 interview problems', 'Time and space complexity proofs', 'DOM tree manipulation problems', 'Promises implementation question'],
              skills: ['Problem Solving', 'Data Structures', 'Coding Interviews'],
              importance: 'high',
              estimatedHours: 20,
              practiceTasks: ['Solve 50 curated Blind75 problems', 'Implement Array.prototype.flat from scratch']
            },
            {
              title: 'System Design Basics & Behavioral Interview Mastery',
              description: 'Caching, CDNs, database indexing, client vs server rendering, STAR method storytelling.',
              subtopics: ['High-level web architecture', 'Client-side caching vs server caching', 'STAR method for behavioral questions', 'Resume & portfolio critique'],
              skills: ['System Design', 'Behavioral Interviews', 'Career Pitch'],
              importance: 'high',
              estimatedHours: 15,
              practiceTasks: ['Conduct mock technical interview with a KNWshare expert', 'Refine resume to 1-page action-driven format']
            }
          ],
          milestoneOutcome: 'Ready to clear technical rounds and receive software engineering job offers.'
        }
      ]
    });

    // 3. CREATE CURATED RESOURCES (Connected to Goal, Stage, Topic)
    await Resource.insertMany([
      // Stage 1 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 1,
        topicTitle: 'HTML5 Semantic Architecture',
        title: 'MDN Web Docs: HTML Elements & Semantic Guide',
        description: 'The definitive handbook for modern HTML elements, accessibility considerations, and browser support.',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        type: 'doc',
        difficulty: 'beginner',
        provider: 'Mozilla Developer Network',
        rating: 4.9,
        estimatedHours: 5,
        tags: ['HTML5', 'Semantics', 'Accessibility', 'MDN']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 1,
        topicTitle: 'HTML5 Semantic Architecture',
        title: 'Traversy Media: HTML Crash Course For Absolute Beginners',
        description: 'Hands-on video tutorial covering tags, headers, semantics, forms, and structuring your first real webpage.',
        url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
        type: 'youtube_video',
        difficulty: 'beginner',
        provider: 'Traversy Media',
        rating: 4.8,
        estimatedHours: 2,
        tags: ['HTML', 'Crash Course', 'Video']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 1,
        topicTitle: 'Modern CSS Layouts & Responsive Design',
        title: 'CSS Tricks: Complete Guide to Flexbox & CSS Grid',
        description: 'Visual reference guide covering every property of CSS Flexbox and Grid with interactive diagram examples.',
        url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
        type: 'doc',
        difficulty: 'beginner',
        provider: 'CSS-Tricks',
        rating: 4.9,
        estimatedHours: 4,
        tags: ['CSS', 'Flexbox', 'Grid', 'Layout']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 1,
        topicTitle: 'Modern CSS Layouts & Responsive Design',
        title: 'Kevin Powell: Responsive Web Design Modern Masterclass',
        description: 'Learn modern responsive mental models without writing hundreds of messy media queries.',
        url: 'https://www.youtube.com/playlist?list=PL4-IK0AVhVjM0xE054Uc9O18hPlvBSt7Q',
        type: 'youtube_playlist',
        difficulty: 'intermediate',
        provider: 'Kevin Powell',
        rating: 5.0,
        estimatedHours: 8,
        tags: ['CSS', 'Responsive', 'YouTube Playlist']
      },
      // Stage 2 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 2,
        topicTitle: 'JS Engine Fundamentals & Scope',
        title: 'Namaste JavaScript by Akshay Saini',
        description: 'The acclaimed deep-dive series exploring the JavaScript engine, call stack, execution context, closures, and event loop.',
        url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvPEQRVQK562-z',
        type: 'youtube_playlist',
        difficulty: 'intermediate',
        provider: 'Akshay Saini',
        rating: 4.9,
        estimatedHours: 12,
        tags: ['JavaScript', 'Execution Context', 'Event Loop', 'Closures']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 2,
        topicTitle: 'JS Engine Fundamentals & Scope',
        title: 'You Don\'t Know JS Yet (Book Series)',
        description: 'Kyle Simpson\'s celebrated open-source book series dissecting JavaScript mechanics and lexical scope.',
        url: 'https://github.com/getify/You-Dont-Know-JS',
        type: 'book',
        difficulty: 'intermediate',
        provider: 'GitHub Open Books',
        rating: 4.9,
        estimatedHours: 20,
        tags: ['Book', 'JavaScript', 'Deep Dive']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 2,
        topicTitle: 'Asynchronous JavaScript & Fetch API',
        title: 'JavaScript.info: Promises, async/await & Network Requests',
        description: 'Comprehensive tutorials with clear illustrations explaining microtasks, macrotasks, and async handling.',
        url: 'https://javascript.info/async',
        type: 'doc',
        difficulty: 'beginner',
        provider: 'JavaScript.info',
        rating: 4.9,
        estimatedHours: 6,
        tags: ['Async', 'Promises', 'Tutorial']
      },
      // Stage 3 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 3,
        topicTitle: 'React Components, Props & State',
        title: 'Official React Documentation (react.dev)',
        description: 'The official interactive React docs featuring sandboxes, mental models, and idiomatic component patterns.',
        url: 'https://react.dev/learn',
        type: 'doc',
        difficulty: 'beginner',
        provider: 'Meta React Team',
        rating: 5.0,
        estimatedHours: 15,
        tags: ['React', 'Official Docs', 'Interactive']
      },
      {
        goalId: fullStackGoal._id,
        stageNumber: 3,
        topicTitle: 'Advanced Hooks, Effects & React Router',
        title: 'React Router v6 Comprehensive Guide',
        description: 'Step-by-step guide to client routing, nested layouts, loader functions, and action handlers.',
        url: 'https://reactrouter.com/en/main/start/tutorial',
        type: 'doc',
        difficulty: 'intermediate',
        provider: 'Remix Software',
        rating: 4.8,
        estimatedHours: 4,
        tags: ['React Router', 'Routing', 'SPA']
      },
      // Stage 4 & 5 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 5,
        topicTitle: 'Express Routing & Middleware Architecture',
        title: 'Express.js Complete Guide with REST Architecture',
        description: 'Learn how to structure enterprise Express applications with controllers, routes, and custom error middleware.',
        url: 'https://expressjs.com/en/guide/routing.html',
        type: 'doc',
        difficulty: 'intermediate',
        provider: 'Express.js Team',
        rating: 4.8,
        estimatedHours: 8,
        tags: ['Node', 'Express', 'Backend']
      },
      // Stage 6 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 6,
        topicTitle: 'MongoDB Schema Design & Validation',
        title: 'MongoDB University: Mongoose Data Modeling',
        description: 'Official free course on data modeling, embedding vs referencing, and schema validation.',
        url: 'https://learn.mongodb.com/',
        type: 'course_free',
        difficulty: 'intermediate',
        provider: 'MongoDB University',
        rating: 4.9,
        estimatedHours: 10,
        tags: ['MongoDB', 'NoSQL', 'Database']
      },
      // Stage 7 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 7,
        topicTitle: 'Secure Authentication & JWT Tokens',
        title: 'JWT Authentication in Node/Express Full Tutorial',
        description: 'Complete architecture walkthrough implementing secure JWT authentication, bcrypt passwords, and HTTP cookies.',
        url: 'https://jwt.io/introduction',
        type: 'article',
        difficulty: 'intermediate',
        provider: 'Auth0 / JWT.io',
        rating: 4.8,
        estimatedHours: 5,
        tags: ['Security', 'JWT', 'Bcrypt', 'Auth']
      },
      // Stage 8 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 8,
        topicTitle: 'Capstone: Product Development',
        title: 'Full Stack Open (University of Helsinki)',
        description: 'World-renowned free University curriculum for modern full-stack JavaScript application development.',
        url: 'https://fullstackopen.com/en/',
        type: 'course_free',
        difficulty: 'all_levels',
        provider: 'University of Helsinki',
        rating: 5.0,
        estimatedHours: 40,
        tags: ['FullStack', 'Capstone', 'Free Course']
      },
      // Stage 10 Resources
      {
        goalId: fullStackGoal._id,
        stageNumber: 10,
        topicTitle: 'Core DSA for Frontend & Full-Stack SDE Roles',
        title: 'NeetCode 150 & Blind 75 Coding Roadmaps',
        description: 'Curated list of algorithmic patterns covering arrays, trees, dynamic programming, and graphs.',
        url: 'https://neetcode.io/roadmap',
        type: 'practice_platform',
        difficulty: 'intermediate',
        provider: 'NeetCode',
        rating: 5.0,
        estimatedHours: 35,
        tags: ['DSA', 'LeetCode', 'Interview', 'NeetCode']
      }
    ]);

    console.log('[Seed] Curated resources created successfully.');

    // 4. CREATE VERIFIED EXPERTS / MENTORS
    const experts = await ExpertProfile.insertMany([
      {
        name: 'Priya Sharma',
        headline: 'Senior SDE at Microsoft | Ex-Amazon | Tech Interview Mentor',
        companyOrCollege: 'Microsoft',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        bio: 'Over 6 years of experience scaling distributed systems and mentoring 120+ students into top tier tech companies. Specializes in MERN architecture, backend scalability, and behavioral interview coaching.',
        expertiseAreas: ['Full Stack Development', 'System Design', 'React & Node.js', 'Mock Interviews'],
        targetGoals: [fullStackGoal._id, cpGoal._id],
        yearsOfExperience: 6,
        rating: 4.95,
        sessionsCompleted: 142,
        sessionDurationMinutes: 45,
        topicsCanHelpWith: [
          'Resume review & portfolio critique',
          'Full-stack system architecture feedback',
          'Mock coding & technical interview simulation',
          'Internship search strategy'
        ],
        availableSlots: [
          { dayOfWeek: 'Saturday', startTime: '10:00 AM', endTime: '10:45 AM', isBooked: false },
          { dayOfWeek: 'Saturday', startTime: '11:15 AM', endTime: '12:00 PM', isBooked: false },
          { dayOfWeek: 'Sunday', startTime: '04:00 PM', endTime: '04:45 PM', isBooked: false }
        ]
      },
      {
        name: 'Arjun Mehta',
        headline: 'AI Research Engineer at DeepMind | IIT Bombay Alumnus',
        companyOrCollege: 'Google DeepMind',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: 'Researches foundational models and transformer architectures. Mentors students transitioning into Applied AI, ML research, and competitive mathematics.',
        expertiseAreas: ['Machine Learning', 'Deep Learning & PyTorch', 'LLMs & RAG', 'Research Papers'],
        targetGoals: [mlGoal._id, gateGoal._id],
        yearsOfExperience: 5,
        rating: 4.98,
        sessionsCompleted: 89,
        sessionDurationMinutes: 45,
        topicsCanHelpWith: [
          'Breaking into AI/ML without a PhD',
          'Reviewing machine learning capstones',
          'Choosing relevant research topics',
          'Preparing for AI Engineer interviews'
        ],
        availableSlots: [
          { dayOfWeek: 'Tuesday', startTime: '06:00 PM', endTime: '06:45 PM', isBooked: false },
          { dayOfWeek: 'Thursday', startTime: '07:00 PM', endTime: '07:45 PM', isBooked: false },
          { dayOfWeek: 'Sunday', startTime: '11:00 AM', endTime: '11:45 AM', isBooked: false }
        ]
      },
      {
        name: 'Rohan Verma',
        headline: 'AIR 42 in JEE Advanced | B.Tech CSE IIT Delhi | Academic Coach',
        companyOrCollege: 'IIT Delhi Alumnus',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        bio: 'Cracked JEE Advanced in the top 50 ranks. Has guided hundreds of aspirants in mastering study discipline, revision loops, and overcoming exam anxiety.',
        expertiseAreas: ['JEE Strategy', 'Physics Problem Solving', 'Calculus Mastery', 'Exam Psychology'],
        targetGoals: [jeeGoal._id],
        yearsOfExperience: 4,
        rating: 4.92,
        sessionsCompleted: 210,
        sessionDurationMinutes: 45,
        topicsCanHelpWith: [
          'Timetable optimization for aspirants',
          'Analyzing mock test score plateaus',
          'Doubt clearing in Mechanics & Calculus',
          'Handling exam stress & building focus'
        ],
        availableSlots: [
          { dayOfWeek: 'Monday', startTime: '05:00 PM', endTime: '05:45 PM', isBooked: false },
          { dayOfWeek: 'Wednesday', startTime: '05:00 PM', endTime: '05:45 PM', isBooked: false },
          { dayOfWeek: 'Saturday', startTime: '03:00 PM', endTime: '03:45 PM', isBooked: false }
        ]
      },
      {
        name: 'Devika Patel',
        headline: 'Staff Infrastructure Engineer | Open Source Contributor',
        companyOrCollege: 'Cloudflare',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
        bio: 'Specialist in cloud native deployment, containerization, distributed databases, and high availability systems.',
        expertiseAreas: ['Cloud Architecture', 'DevOps & Docker', 'Backend Systems', 'Open Source'],
        targetGoals: [fullStackGoal._id, gateGoal._id],
        yearsOfExperience: 8,
        rating: 4.97,
        sessionsCompleted: 115,
        sessionDurationMinutes: 45,
        topicsCanHelpWith: [
          'Docker & Kubernetes container strategy',
          'Designing for zero downtime',
          'Contributing to major open source projects'
        ],
        availableSlots: [
          { dayOfWeek: 'Friday', startTime: '06:00 PM', endTime: '06:45 PM', isBooked: false },
          { dayOfWeek: 'Saturday', startTime: '02:00 PM', endTime: '02:45 PM', isBooked: false }
        ]
      }
    ]);

    console.log('[Seed] Verified mentors created successfully.');

    // 5. CREATE DEFAULT DEMO STUDENT & INITIAL ENROLLMENT
    let student = await User.findOne({ email: 'student@knwshare.dev' });
    if (!student) {
      student = await User.create({
        name: 'Alex Rivera',
        email: 'student@knwshare.dev',
        password: 'password123',
        role: 'student',
        bio: 'Computer Science student passionate about full stack engineering and modern web platforms.',
        preferences: {
          defaultHoursPerDay: 2,
          preferredStudyTime: 'morning',
          emailNotifications: true,
          inAppReminders: true
        }
      });
    }

    // Enroll demo student in Full Stack Development
    let demoUserGoal = await UserGoal.findOne({ userId: student._id, goalId: fullStackGoal._id });
    if (!demoUserGoal) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 6);

      demoUserGoal = await UserGoal.create({
        userId: student._id,
        goalId: fullStackGoal._id,
        currentLevel: 'beginner',
        targetDate,
        hoursPerDay: 2,
        hoursPerWeek: 14,
        status: 'active',
        completedStages: [1],
        completedTopics: ['1:HTML5 Semantic Architecture', '1:Modern CSS Layouts & Responsive Design'],
        overallProgress: 15
      });

      student.activeGoal = demoUserGoal._id;
      await student.save();
    }

    // Seed a couple of initial sample tasks so the timetable/tasks page looks populated right away
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Task.deleteMany({ userId: student._id });

    await Task.create([
      {
        userId: student._id,
        userGoalId: demoUserGoal._id,
        goalId: fullStackGoal._id,
        stageNumber: 1,
        topicTitle: 'HTML5 Semantic Architecture',
        title: 'Complete Semantic HTML Lab',
        description: 'Build an accessible multi-section landing page using main, nav, section, article, and footer tags.',
        date: todayStr,
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        durationMinutes: 60,
        priority: 'high',
        status: 'completed',
        completedAt: new Date(),
        originalDate: todayStr
      },
      {
        userId: student._id,
        userGoalId: demoUserGoal._id,
        goalId: fullStackGoal._id,
        stageNumber: 2,
        topicTitle: 'JS Engine Fundamentals & Scope',
        title: 'Study: JS Call Stack & Closures',
        description: 'Deep dive into lexical scope chains and understand memory allocation during execution context creation.',
        date: todayStr,
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        durationMinutes: 60,
        priority: 'high',
        status: 'pending',
        originalDate: todayStr
      },
      {
        userId: student._id,
        userGoalId: demoUserGoal._id,
        goalId: fullStackGoal._id,
        stageNumber: 2,
        topicTitle: 'JS Engine Fundamentals & Scope',
        title: 'Practice: Write Custom Debounce & Memoize',
        description: 'Implement higher-order helper functions from scratch to verify understanding of closures.',
        date: tomorrowStr,
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        durationMinutes: 90,
        priority: 'medium',
        status: 'pending',
        originalDate: tomorrowStr
      }
    ]);

    console.log('[Seed] Database populated with goals, roadmaps, resources, mentors, demo user, and tasks!');
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
