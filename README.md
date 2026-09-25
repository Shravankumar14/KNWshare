# KNWshare 🎯

> **From Goal to Mastery** — A modern, production-grade MERN platform for students to navigate from initial ambition to daily execution.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-026bc9.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-646cff.svg)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248.svg)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Product Vision & Philosophy

Most students fail to achieve their career and academic aspirations not because of a lack of ambition, but because of a fragmented path between a high-level dream and daily execution.

**KNWshare** enforces a strict, cohesive progression:

$$\mathbf{GOAL} \longrightarrow \mathbf{ROADMAP} \longrightarrow \mathbf{CAREER\ GUIDANCE} \longrightarrow \mathbf{RESOURCES} \longrightarrow \mathbf{TIMETABLE} \longrightarrow \mathbf{TASKS} \longrightarrow \mathbf{PROGRESS}$$

Every resource, timetable block, task, and milestone is anchored directly to the student's active **Goal**.

---

## ✨ Key Features

### 1. Goal Selection — Front & Center (Page 1)
- **Zero generic marketing bloat**: The first screen asks: *"What do you want to achieve?"*
- Pre-curated goal templates:
  - **Full Stack Web Development** (10-stage path to SDE-1)
  - **Machine Learning & AI** (Math, Scikit-Learn, PyTorch, LLMs)
  - **Competitive Programming & DSA** (LeetCode, Codeforces, FAANG patterns)
  - **JEE Mains & Advanced** (Physics, Chemistry, Maths, speed drills)
  - **GATE Computer Science & IT** (Systems, Networks, DBMS, PYQs)
- **AI Custom Goal Creator**: Enter any custom ambition (e.g., *DevOps Cloud Architecture*, *Rust Systems*) and the curriculum engine automatically decomposes it into stages, milestones, and target roles.
- Personalized onboarding wizard capturing current skill level, target timeline, and available hours/day.

### 2. Roadmap + Career Path Guidance + Expert Booking (Page 2)
- Unified roadmap and career ladder on the same view.
- Stage-by-stage progression with dependency awareness, estimated hours, topic lists, and subtopic checklists.
- **Career Ladder**: *Current Level → Core Skills → Projects → Experience → Internships → Interview Prep → Target Career*.
- **1-on-1 Guidance with Real Mentors**: Browse verified industry experts (Microsoft, Google DeepMind, IIT alumni), inspect availability, and book 45-minute video sessions with instant HD video room links (Jitsi Meet).

### 3. Stage-Linked Resources Hub (Page 3)
- Non-random, curated materials directly connected to: `Goal → Roadmap Stage → Topic`.
- Filterable by type (YouTube playlists, official docs, free courses, books, practice platforms, project repos) and difficulty level.
- 1-click bookmarking to add resources to personal study plans.

### 4. Realistic Weekly Timetable Generator (Page 4)
- Sub-page planning wizard configured by:
  - Available study days (Mon–Sun)
  - Daily hours quota
  - Preferred study period (Morning, Afternoon, Evening, Night)
  - Automatic 15-minute recovery buffer breaks
- Balances conceptual study sessions with hands-on practice blocks.

### 5. Task Management & Intelligent Pending Rescheduler (Page 5)
- Automated synchronization between Timetable blocks and actionable Tasks.
- Full status lifecycle: `Pending`, `In Progress`, `Completed`, `Overdue`, `Rescheduled`.
- **Intelligent Overload Prevention**: Missed yesterday's tasks? Instead of dumping everything onto tomorrow and triggering burnout, the intelligent rescheduler calculates remaining capacity across future days and smoothly redistributes overdue tasks.

### 6. Honest Progress Analytics (Page 6)
- Actionable progress without meaningless gamification:
  - *"Where am I right now?"* — Visual goal completion gauge.
  - *"What have I completed?"* — Stage-by-stage mastery bars and earned milestones.
  - *"What should I do next?"* — Active agenda and upcoming timetable blocks.
  - Consistency streak and total focused hours logged.

---

## 🏗️ Architecture & Technology Stack

```
KNWshare/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS, React Router)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar with persistent goal badge, Footer
│   │   │   ├── goal/           # GoalCard, OnboardingModal, CustomGoalModal
│   │   │   ├── roadmap/        # RoadmapStageCard, CareerPathGuidance
│   │   │   ├── resources/      # ResourceCard, filters
│   │   │   ├── timetable/      # TimetableGeneratorModal
│   │   │   ├── tasks/          # TaskCard, RescheduleModal
│   │   │   └── expert/         # ExpertCard, BookingModal
│   │   ├── context/            # AuthContext, GoalContext, NotificationContext
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # GoalSelection, RoadmapCareer, Resources, etc.
│   │   ├── services/           # Axios API client with JWT interceptor
│   │   ├── App.jsx             # React Router routing tree
│   │   └── index.css           # Tailwind directives
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend (Node.js, Express.js, MongoDB, Mongoose)
│   ├── config/                 # db.js (with auto-fallback to embedded Mongo)
│   ├── models/                 # User, Goal, UserGoal, Roadmap, Resource, Task, etc.
│   ├── controllers/            # Auth, Goal, Roadmap, Resource, Timetable, Task, etc.
│   ├── routes/                 # Express routers mounted on /api/v1/...
│   ├── middleware/             # authMiddleware (JWT protect), errorMiddleware
│   ├── services/
│   │   ├── timetableService.js     # Timetable generation algorithm
│   │   ├── taskSchedulerService.js # Intelligent pending task redistribution
│   │   ├── progressService.js      # Completion & streak analytics
│   │   └── ai/                     # Clean AI Abstraction Layer
│   │       ├── aiProviderInterface.js  # Contract specification
│   │       ├── ruleBasedProvider.js    # Structured deterministic engine
│   │       ├── huggingFaceProvider.js  # Hugging Face Inference API client
│   │       └── aiService.js            # Orchestrator
│   ├── seeds/                  # seedData.js (Goals, 10-stage roadmaps, resources, mentors)
│   └── server.js               # Express application entry point
│
└── package.json                # Root orchestration scripts
```

---

## 🤖 Future AI Integration Architecture

KNWshare is designed with a strict **Service Abstraction Layer** (`server/services/ai/`).

```javascript
// Provider interface contract (aiProviderInterface.js)
export class AIProviderInterface {
  async decomposeGoal(goalPrompt, currentLevel, targetMonths) { ... }
  async recommendResources(goalTitle, stageNumber, topic, userKnowledge) { ... }
  async optimizeTimetableSchedule(constraints) { ... }
  async analyzeSkillGaps(targetRole, currentSkills) { ... }
}
```

- **Initial Mode (`rule_based`)**: Ships with a rich, deterministic curriculum synthesis engine that generates stages, milestones, and practice tasks without requiring external API keys.
- **Hugging Face / LLM Integration (`huggingface` / `llm`)**: To switch to Hugging Face or OpenAI, simply toggle:
  ```env
  AI_PROVIDER=huggingface
  HUGGINGFACE_API_KEY=hf_your_key_here
  HUGGINGFACE_MODEL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2
  ```
  **Zero refactoring of routes, database schemas, or frontend components is required.**

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: v18+ (Tested on Node v24)
- **npm**: v9+

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url> KNWshare
cd KNWshare

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env` (a template is already provided in `server/.env`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=knwshare_jwt_super_secret_production_key_2026
JWT_EXPIRES_IN=30d

# MongoDB URI (Leave empty to use automatic embedded in-memory MongoDB!)
# MONGODB_URI=mongodb://127.0.0.1:27017/knwshare

# AI Settings (defaults to built-in rule_based engine)
AI_PROVIDER=rule_based
# HUGGINGFACE_API_KEY=
```

> **Zero-Friction Database Setup**: If no `MONGODB_URI` is supplied or if a local MongoDB service is not running, KNWshare automatically launches an embedded in-memory MongoDB server on startup and seeds default goals, roadmaps, and mentors immediately.

### 3. Run Application

You can launch both frontend and backend using root scripts or individually:

#### Option A: Individual Terminals
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

#### Option B: From Root Directory
```bash
npm run server   # Starts Express backend on http://localhost:5000
npm run client   # Starts Vite React on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification

1. **Front Page Landing**: Navigate to `http://localhost:5173`. Unauthenticated visitors see the secure Black + Gold Login portal.
2. **Sign In / Registration**: Create an account or sign in with your Gmail credentials.
3. **Select Goal**: Choose **"Full Stack Development"**, adjust daily hours to 2 hrs/day, and click **"Launch My Journey"**.
4. **Interactive Roadmap**:
   - Inspect Stage 1 through Stage 10.
   - Check off a topic (e.g. *HTML5 Semantic Architecture*) and observe the progress bar update in real time.
   - Switch to **Career Path Guidance Ladder** tab to review milestones.
   - Switch to **1-on-1 Expert Mentors** tab and book a session with *Priya Sharma* (generates a live Jitsi video room link).
5. **Resources Hub**: Switch to `/resources`. Filter by *Stage 1*, select *Documentation*, and bookmark a resource.
6. **Timetable Generation**: Switch to `/timetable`. Click **"Generate My Timetable"**, select Mon–Fri, 2 hrs/day with breaks, and generate your schedule.
7. **Task Board & Smart Rescheduling**:
   - Switch to `/tasks`. Check off a task.
   - Test overdue recovery by clicking **"⚡ Smart Reschedule Pending Tasks"** to watch the algorithm redistribute pending tasks without piling onto tomorrow.
8. **Progress Analytics**: Switch to `/progress` to review goal percentage, hours focused, and streak stats.

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new student or teacher account | No |
| `POST` | `/api/v1/auth/login` | Login with Gmail & password | No |
| `POST` | `/api/v1/auth/google` | Google OAuth ID token verification & session | No |
| `GET` | `/api/v1/goals` | Catalog of all active & community goals | No |
| `POST` | `/api/v1/goals/select` | Enroll/activate a goal for the student | Yes |
| `POST` | `/api/v1/goals/custom` | Synthesize & decompose a custom goal via AI | Yes |
| `GET` | `/api/v1/roadmaps/:goalId` | Get stages, topics, and completion status | Optional |
| `POST` | `/api/v1/roadmaps/toggle-topic` | Mark topic completed/incomplete | Yes |
| `GET` | `/api/v1/resources` | Query curated resources by goal, stage, type | Optional |
| `POST` | `/api/v1/resources/toggle-select` | Bookmark resource to study plan | Yes |
| `POST` | `/api/v1/timetable/generate` | Generate realistic weekly schedule & tasks | Yes |
| `GET` | `/api/v1/timetable/current` | Fetch active weekly timetable | Yes |
| `GET` | `/api/v1/tasks` | Get student tasks (filter by date, status) | Yes |
| `PATCH` | `/api/v1/tasks/:id/status` | Update task status & recalculate progress | Yes |
| `POST` | `/api/v1/tasks/reschedule-pending`| **Intelligent pending task load balancer** | Yes |
| `GET` | `/api/v1/progress/summary` | Progress metrics, stage mastery, streaks | Yes |
| `GET` | `/api/v1/experts` | List verified 1-on-1 industry mentors | No |
| `POST` | `/api/v1/experts/book` | Book mentorship slot & generate video room | Yes |

---

## 🛡️ Security & Best Practices

- **Password Protection**: Passwords hashed with `bcryptjs` using 10 salt rounds.
- **JWT Authorization**: Stateless bearer tokens with 30-day expiration.
- **Input Validation**: Mongoose schema-level constraints and validation regex.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `student`, `expert`, and `admin`.
- **Secrets Isolation**: No database passwords or AI API keys exposed to the client.

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify)
1. Push repository to GitHub.
2. Link `client/` folder in Vercel.
3. Set Build Command: `npm run build`, Output Directory: `dist`.
4. Add environment variable: `VITE_API_URL=https://your-backend-domain.com/api/v1`.

### Backend (Render / Railway / AWS EC2)
1. Deploy `server/` folder to Render/Railway Web Service.
2. Set Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `JWT_SECRET=<strong-random-key>`
   - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
   - `AI_PROVIDER=rule_based` (or `huggingface`)
3. Build Command: `npm install`, Start Command: `node server.js`.

---

## 📄 License

MIT © KNWshare Contributors. Built with pride for student growth.
