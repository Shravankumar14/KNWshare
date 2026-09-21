import { AIProviderInterface } from './aiProviderInterface.js';
import { RuleBasedAIProvider } from './ruleBasedProvider.js';

export class HuggingFaceAIProvider extends AIProviderInterface {
  constructor() {
    super();
    this.fallback = new RuleBasedAIProvider();
    this.apiKey = process.env.HUGGINGFACE_API_KEY || null;
    this.modelEndpoint = process.env.HUGGINGFACE_MODEL || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
  }

  async decomposeGoal(goalPrompt, currentLevel, targetMonths) {
    if (!this.apiKey) {
      console.log('[AI Service: HuggingFace] No HUGGINGFACE_API_KEY detected. Utilizing structured deterministic engine.');
      return this.fallback.decomposeGoal(goalPrompt, currentLevel, targetMonths);
    }

    try {
      // Future HuggingFace Inference API call
      const prompt = `As a curriculum architect, decompose the goal "${goalPrompt}" for a ${currentLevel} student with a ${targetMonths}-month timeline into JSON stages.`;
      const response = await fetch(this.modelEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 800, temperature: 0.3 }
        })
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API response status: ${response.status}`);
      }

      const result = await response.json();
      return JSON.parse(result[0].generated_text);
    } catch (err) {
      console.warn('[AI Service: HuggingFace] Failed to query model. Falling back to rule-based decomposition:', err.message);
      return this.fallback.decomposeGoal(goalPrompt, currentLevel, targetMonths);
    }
  }

  async recommendResources(goalTitle, stageNumber, topic, userKnowledge) {
    return this.fallback.recommendResources(goalTitle, stageNumber, topic, userKnowledge);
  }

  async optimizeTimetableSchedule(constraints) {
    return this.fallback.optimizeTimetableSchedule(constraints);
  }

  async analyzeSkillGaps(targetRole, currentSkills) {
    return this.fallback.analyzeSkillGaps(targetRole, currentSkills);
  }
}
