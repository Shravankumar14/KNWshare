/**
 * AI Provider Interface / Abstract Base Class
 * Defines the contract for all AI integrations (RuleBased, HuggingFace, LLM/OpenAI, etc.)
 */
export class AIProviderInterface {
  /**
   * Decomposes a raw goal into structured stages, topics, and estimated hours
   * @param {string} goalPrompt - e.g. "Learn Rust Systems Programming"
   * @param {string} currentLevel - "beginner" | "intermediate" | "advanced"
   * @param {number} targetMonths - e.g. 6
   * @returns {Promise<{ stages: Array, careerPath: Array, targetRoles: Array }>}
   */
  async decomposeGoal(goalPrompt, currentLevel, targetMonths) {
    throw new Error('decomposeGoal method must be implemented by the provider');
  }

  /**
   * Recommends contextual resources tailored to user stage and knowledge gaps
   * @param {string} goalTitle
   * @param {number} stageNumber
   * @param {string} topic
   * @param {Array<string>} userKnowledge
   * @returns {Promise<Array>}
   */
  async recommendResources(goalTitle, stageNumber, topic, userKnowledge) {
    throw new Error('recommendResources method must be implemented by the provider');
  }

  /**
   * Generates intelligent adaptive timetable allocation
   * @param {Object} constraints
   * @returns {Promise<Array>}
   */
  async optimizeTimetableSchedule(constraints) {
    throw new Error('optimizeTimetableSchedule method must be implemented by the provider');
  }

  /**
   * Compares current student skills against industry requirements
   * @param {string} targetRole
   * @param {Array<string>} currentSkills
   * @returns {Promise<Object>}
   */
  async analyzeSkillGaps(targetRole, currentSkills) {
    throw new Error('analyzeSkillGaps method must be implemented by the provider');
  }
}
