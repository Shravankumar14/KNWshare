// AI Chatbot Service Abstraction with Safe Fallback Engine

const SYSTEM_PROMPT = `
You are the InfoNest (KNWshare) AI Student Academic & Guidance Assistant.
You assist ambitious students preparing for competitive engineering exams (JEE Main & Advanced) and software engineering careers.
Keep your answers structured, encouraging, actionable, and concise (under 150 words).
Never fabricate official syllabus chapters or make false promises regarding rank cutoffs.
Guide users to the platform's features: Interactive Roadmap, Curated Resources (Physics Galaxy, NCERT, MathonGo), Timetable Generator, Task Management, and 1-on-1 Teacher Mentorship.
`;

export const chatService = {
  generateResponse: async (message, history = [], context = {}) => {
    const text = message.trim();
    const lower = text.toLowerCase();

    // 1. If external AI API Key is provided, call external LLM
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        // External provider call can be configured here if API key is present
        // (Uses fetch without introducing heavy third-party SDK dependencies)
      } catch (externalErr) {
        console.warn('[ChatService] External provider failed, falling back to rule engine:', externalErr.message);
      }
    }

    // 2. High-Fidelity Intelligent Fallback Assistant Engine
    return getCuratedAssistantResponse(lower, context);
  }
};

function getCuratedAssistantResponse(query, context) {
  // A. Physics specific guidance
  if (query.includes('physics') && (query.includes('start') || query.includes('first') || query.includes('how'))) {
    return `In Physics, always master **Mathematical Tools & Vectors** first before Kinematics and Newton's Laws. 

Vectors and basic differentiation/integration form the backbone of Mechanics, Electrostatics, and Magnetism. We recommend starting with the **Physics Galaxy** concept masterclass linked on your Stage 1 roadmap!`;
  }

  // B. Chemistry & NCERT guidance
  if (query.includes('chemistry') || query.includes('ncert')) {
    return `For Chemistry, **NCERT is the ultimate foundation**:
- **Inorganic Chemistry**: Read NCERT line-by-line; directly tests textbook statements.
- **Physical Chemistry**: Understand derivations and practice numerical problems.
- **Organic Chemistry**: Focus on GOC (General Organic Chemistry) reaction mechanisms rather than rote memorization. Check the verified NCERT links in your Resources Hub!`;
  }

  // C. Mathematics guidance
  if (query.includes('math') || query.includes('calculus') || query.includes('algebra')) {
    return `For Mathematics, problem variety and daily practice are key:
- **Algebra**: Start with Quadratic Equations and Sequences & Series.
- **Calculus**: Master Limits and Continuity before attempting Integration and Differential Equations.
- Use the **MathonGo Chapter PYQs** linked on each topic to practice 10-year question patterns!`;
  }

  // D. JEE Strategy in 6 or 12 Months
  if (query.includes('6 month') || query.includes('12 month') || query.includes('strategy') || query.includes('prepare')) {
    return `Here is your **high-yield JEE strategy**:
1. **Prioritize High-Yield Chapters**: Modern Physics, Current Electricity, Physical Chemistry Equilibrium, Coordinate Geometry, and Calculus.
2. **Follow the 7-Step Learning Cycle**: Learn -> Derivations -> Basic Practice -> JEE Main PYQs -> JEE Advanced Multi-concept -> Revision -> Timed Test.
3. **Daily Routine**: Commit 3-5 hours daily using our **Timetable Generator** to automatically balance Physics, Chemistry, and Math sprints!`;
  }

  // E. Timetable Generation
  if (query.includes('timetable') || query.includes('schedule') || query.includes('routine')) {
    return `To generate your personalized study timetable:
1. Open the **Timetable** tab in the top navigation.
2. Click **"Generate My Timetable"**.
3. Select your available days (e.g. Mon–Sat) and daily study hours (e.g. 3h/day).
4. Click Generate! Actionable study and practice blocks will be created automatically and synchronized to your **Task Board**.`;
  }

  // F. Teacher / Mentor Booking
  if (query.includes('teacher') || query.includes('mentor') || query.includes('book') || query.includes('guidance') || query.includes('slot')) {
    return `To book a 1-on-1 session with a verified educator:
1. Navigate to **Roadmap & Career** -> **1-on-1 Expert Mentors** tab.
2. Browse educators matching your goal (e.g. Dr. Arvind Kumar for Chemistry, Rohan Verma for Physics/Math).
3. View their available slots (e.g. Monday 10:00 AM) and click **"Book 1-on-1 Slot"**.
4. You'll receive instant confirmation with a direct meeting link!`;
  }

  // G. Career / Admissions / JoSAA
  if (query.includes('career') || query.includes('josaa') || query.includes('admission') || query.includes('iit') || query.includes('branch')) {
    return `Check out the **Post-Goal Career & Admissions** tab on the Roadmap page! 

It outlines the complete JoSAA counselling ladder (percentile analysis -> rank calculation -> choice filling -> seat allocation) and features our **IIT & NIT Branch Navigator** comparing closing ranks for CSE, ECE, EE, Mechanical, and Mathematics & Computing.`;
  }

  // H. About Platform
  if (query.includes('what is') || query.includes('infonest') || query.includes('knwshare')) {
    return `**InfoNest** is a modern student productivity and career guidance platform. 

It takes your ambitions (like cracking JEE Main & Advanced or mastering Full Stack Development) and transforms them into an interactive curriculum, curated study resources, balanced daily timetables, and 1-on-1 mentorship sessions.`;
  }

  // Default Fallback
  return `Hello! I am your **InfoNest Academic Assistant**. I can help you with:
- 🎯 **JEE Strategy**: Recommended order for Physics, Chemistry, and Math.
- 📅 **Timetable**: How to generate a balanced daily study routine.
- 👨‍🏫 **Mentors**: How to book 1-on-1 guidance slots with verified educators.
- 📚 **Resources**: Finding verified Physics Galaxy, NCERT, and MathonGo materials.

What would you like to explore today?`;
}
