// Gemini Backend Service — Strict Server-Side Boundary
// GEMINI_API_KEY is read solely from process.env, never from user requests or responses.

const SYSTEM_INSTRUCTION = `You are the KNWshare AI Student Academic & Guidance Assistant.
You guide ambitious students across 4 domains:
1. JEE Main & Advanced (Physics, Chemistry, Math concepts, PYQs, NCERT, Physics Galaxy)
2. Full Stack Development (MERN, system design, databases, clean architecture)
3. Competitive Programming & DSA (Algorithms, LeetCode, Codeforces, complexity analysis)
4. Machine Learning & AI (Linear Algebra, PyTorch, Transformers, RAG, ML engineering)

Platform capabilities to guide users toward:
- Structured Roadmaps & Stages
- Curated Verified Study Resources
- Personalized Timetable Generator
- Actionable Daily Task Management
- 1-on-1 Verified Educator / Mentor Booking

Formatting guidelines:
- Concise, motivating, structured with markdown bullets (under 160 words).
- If student has an active goal, tailor advice specifically to their goal, progress, and upcoming tasks.
- If student has NO active goal, warmly invite them to choose one of the 4 paths to unlock their structured curriculum.
- Never make up syllabus chapters or fake rank cutoff guarantees.`;

export class GeminiService {
  constructor() {
    this.modelName = 'gemini-1.5-flash';
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || null;
  }

  async generateReply({ message, history = [], safeContext = {} }) {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return this.getCannedFallbackResponse(message, safeContext, 'no_key');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      // Build context string from safe sanitized subset
      let contextPrompt = `[STUDENT CONTEXT]\nRole: ${safeContext.userRole || 'student'}\n`;
      if (safeContext.activeGoal) {
        contextPrompt += `Active Goal: ${safeContext.activeGoal.title} (${safeContext.activeGoal.slug})\n`;
      } else {
        contextPrompt += `Active Goal: None selected yet\n`;
      }
      if (safeContext.levelAndPacing) {
        contextPrompt += `Pacing: ${safeContext.levelAndPacing.level}, ${safeContext.levelAndPacing.hoursPerDay}h/day, ${safeContext.levelAndPacing.daysPerWeek} days/week\n`;
      }
      if (safeContext.progressSummary) {
        contextPrompt += `Overall Progress: ${safeContext.progressSummary.overallProgress}%, Current Stage: ${safeContext.progressSummary.currentStage}\n`;
      }
      if (safeContext.upcomingTasks && safeContext.upcomingTasks.length > 0) {
        contextPrompt += `Upcoming Tasks: ${safeContext.upcomingTasks.map(t => t.title).join('; ')}\n`;
      }

      // Convert history to Gemini contents format
      const contents = [];
      contents.push({
        role: 'user',
        parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${contextPrompt}\nPlease assist this student.` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood. I am your KNWshare Academic Assistant. How can I help you excel today?` }]
      });

      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          const role = h.role === 'user' ? 'user' : 'model';
          const text = h.content || h.text || '';
          if (text) {
            contents.push({ role, parts: [{ text }] });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.warn(`[GeminiService] API returned ${response.status}:`, errorBody.slice(0, 120));
        return this.getCannedFallbackResponse(message, safeContext, `api_error_${response.status}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const replyText = candidate?.content?.parts?.[0]?.text;

      if (!replyText) {
        return this.getCannedFallbackResponse(message, safeContext, 'empty_response');
      }

      return replyText.trim();
    } catch (err) {
      console.warn('[GeminiService] Call failed, using context-aware fallback:', err.message);
      return this.getCannedFallbackResponse(message, safeContext, err.name === 'AbortError' ? 'timeout' : 'network_error');
    }
  }

  getCannedFallbackResponse(query, context, reason) {
    const q = (query || '').toLowerCase();
    const activeGoalTitle = context?.activeGoal?.title;

    if (q.includes('physics') || (activeGoalTitle && activeGoalTitle.includes('JEE') && q.includes('start'))) {
      return `In **Physics**, always build mastery in **Mathematical Tools & Vectors** before mechanics and kinematics.\n\nVectors and calculus derivatives form the foundation of Mechanics and Electromagnetism. Check out the verified concept links in Stage 1 of your **Roadmap**!`;
    }

    if (q.includes('chemistry') || q.includes('ncert')) {
      return `For **Chemistry**, NCERT is your core text:\n- **Inorganic**: Line-by-line reading; exam statements directly cite NCERT.\n- **Physical**: Focus on derivations and numerical problem drills.\n- **Organic**: Master GOC (General Organic Chemistry) reaction mechanisms.\nCheck verified resources in your **Resources Hub**!`;
    }

    if (q.includes('math') || q.includes('calculus') || q.includes('dsa') || q.includes('algorithm')) {
      return `For **Problem Solving & Mathematics**:\n- Break complex problems into smaller subproblems.\n- Master Fundamentals (Quadratics/Sequences for JEE; Arrays/Hashing for DSA) before advanced topics.\n- Schedule daily timed practice blocks with your **Timetable Generator**!`;
    }

    if (q.includes('timetable') || q.includes('schedule') || q.includes('routine')) {
      return `To generate your personalized schedule:\n1. Click **Timetable** in the top navigation.\n2. Choose **"Generate My Timetable"**.\n3. Configure your daily hours and available days.\nActionable practice blocks will be placed automatically onto your **Task Board**!`;
    }

    if (q.includes('mentor') || q.includes('teacher') || q.includes('book') || q.includes('slot')) {
      return `To book a 1-on-1 mentorship session:\n1. Scroll down to the **Available Mentors** section on Home or visit **Roadmap**.\n2. Choose a verified educator matching your goals.\n3. Click **"Book Slot"** on any available time slot for instant confirmation and a secure video meeting room!`;
    }

    if (!context?.activeGoal) {
      return `Welcome to **KNWshare**! You haven't selected a learning goal yet. Choose from **JEE Main & Advanced**, **Full Stack Development**, **Competitive Programming**, or **Machine Learning & AI** to unlock personalized roadmaps, study resources, and timetable routines!`;
    }

    return `Hello! I am your **KNWshare Academic Assistant**. You are currently enrolled in **${context.activeGoal.title}** (Progress: ${context.progressSummary?.overallProgress || 0}%).\n\nI can help you prioritize upcoming topics, structure your daily study timetable, recommend curated resources, or book 1-on-1 sessions with verified educators. What would you like to focus on today?`;
  }
}

export const geminiService = new GeminiService();
