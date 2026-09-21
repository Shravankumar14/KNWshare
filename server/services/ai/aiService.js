import { RuleBasedAIProvider } from './ruleBasedProvider.js';
import { HuggingFaceAIProvider } from './huggingFaceProvider.js';

class AIService {
  constructor() {
    const providerType = process.env.AI_PROVIDER || 'rule_based';
    console.log(`[AIService] Initializing provider: ${providerType}`);

    if (providerType === 'huggingface') {
      this.provider = new HuggingFaceAIProvider();
    } else {
      this.provider = new RuleBasedAIProvider();
    }
  }

  async decomposeGoal(goalPrompt, currentLevel, targetMonths) {
    return this.provider.decomposeGoal(goalPrompt, currentLevel, targetMonths);
  }

  async recommendResources(goalTitle, stageNumber, topic, userKnowledge) {
    return this.provider.recommendResources(goalTitle, stageNumber, topic, userKnowledge);
  }

  async optimizeTimetableSchedule(constraints) {
    return this.provider.optimizeTimetableSchedule(constraints);
  }

  async analyzeSkillGaps(targetRole, currentSkills) {
    return this.provider.analyzeSkillGaps(targetRole, currentSkills);
  }
}

export const aiService = new AIService();
