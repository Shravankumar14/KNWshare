import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Service for KNWshare / InfoNest
 * Uses Google Gen AI SDK (@google/genai).
 * GEMINI_API_KEY and GEMINI_MODEL are read strictly from process.env.
 * The API key is never logged or exposed.
 */

const SYSTEM_INSTRUCTION = `You are InfoNest Assistant, the official AI academic coach and guide for KNWshare / InfoNest.
You provide intelligent, actionable, structured guidance to students across all major domains:
1. JEE Main & Advanced (Physics, Chemistry, Mathematics, concept foundations, PYQ strategies, revision cycles)
2. Full Stack Web Development (MERN stack, frontend engineering, backend architectures, APIs, databases)
3. Data Structures & Algorithms (Problem solving, complexity analysis, competitive programming, pattern recognition)
4. Machine Learning & AI (Math for ML, Python, neural networks, PyTorch, LLMs, practical applications)
5. Platform guidance: Roadmaps & stage pacing, weekly timetable generation, daily actionable tasks, progress tracking, and 1-on-1 verified teacher / mentor bookings.

Guidelines:
- Provide real, helpful, accurate guidance tailored to the user's questions. Do not give canned generic replies.
- When student context is provided (active goal, roadmap stage, completed topics, pending tasks, study hours), naturally incorporate it into your recommendations.
- Keep explanations clear, motivating, and well-structured with markdown headings and bullet points.
- Never make up fake rank cutoffs or false guarantees. Never output or ask for credentials, tokens, or sensitive information.`;

export class GeminiService {
  constructor() {
    this._ai = null;
  }

  getAiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is not configured.');
    }
    if (!this._ai) {
      this._ai = new GoogleGenAI({ apiKey });
    }
    return this._ai;
  }

  async generateReply({ message, history = [], safeContext = {} }) {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error('A valid message string is required.');
    }

    const ai = this.getAiClient();
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // Format optional student context if available
    let contextHeader = '';
    if (safeContext && Object.keys(safeContext).length > 0) {
      const parts = [];
      if (safeContext.activeGoal?.title) {
        parts.push(`Active Goal: ${safeContext.activeGoal.title}`);
      }
      if (safeContext.progressSummary?.overallProgress !== undefined) {
        parts.push(`Overall Progress: ${safeContext.progressSummary.overallProgress}%`);
      }
      if (safeContext.progressSummary?.currentStage) {
        parts.push(`Current Stage: ${safeContext.progressSummary.currentStage}`);
      }
      if (safeContext.levelAndPacing?.hoursPerDay) {
        parts.push(`Daily Study Commitment: ${safeContext.levelAndPacing.hoursPerDay} hours/day`);
      }
      if (safeContext.upcomingTasks && safeContext.upcomingTasks.length > 0) {
        parts.push(`Pending Tasks: ${safeContext.upcomingTasks.map(t => t.title).join(', ')}`);
      }
      if (parts.length > 0) {
        contextHeader = `[STUDENT CONTEXT]\n${parts.join('\n')}\n\n`;
      }
    }

    // Build chat contents
    const contents = [];

    // Prior session history
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        const role = item.role === 'user' ? 'user' : 'model';
        const text = item.content || item.text || '';
        if (text) {
          contents.push({
            role,
            parts: [{ text }]
          });
        }
      }
    }

    // Current user prompt with context header
    contents.push({
      role: 'user',
      parts: [{ text: `${contextHeader}${message.trim()}` }]
    });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const text = response.text;
    if (!text || text.trim() === '') {
      throw new Error('Empty response received from Gemini.');
    }

    return text.trim();
  }
}

export const geminiService = new GeminiService();
export default geminiService;
