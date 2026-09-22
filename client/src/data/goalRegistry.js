import jeeData from './goals/jee-main-advanced.json';
import fullStackData from './goals/full-stack-development.json';
import cpDsaData from './goals/competitive-programming-dsa.json';
import mlAiData from './goals/machine-learning-ai.json';

export const DEFAULT_GOAL_SLUG = 'jee-main-advanced';

export const GOAL_REGISTRY = {
  'jee-main-advanced': jeeData,
  'jee-mains-advanced': jeeData, // Backward compatibility alias
  'full-stack-development': fullStackData,
  'competitive-programming-dsa': cpDsaData,
  'machine-learning-ai': mlAiData,
};

export const PREDEFINED_GOALS = [
  jeeData.goal,
  fullStackData.goal,
  cpDsaData.goal,
  mlAiData.goal,
];

/**
 * Clean slug resolver
 */
export const resolveCanonicalGoalSlug = (slug) => {
  if (!slug) return DEFAULT_GOAL_SLUG;
  if (slug === 'jee-mains-advanced') return 'jee-main-advanced';
  return slug;
};

/**
 * Returns goal data strictly matching the requested slug.
 * ZERO cross-goal fallback: returns null if slug is unknown.
 */
export const getGoalDataBySlug = (slug) => {
  if (!slug) return null;
  const canonical = resolveCanonicalGoalSlug(slug);
  return GOAL_REGISTRY[canonical] || null;
};

/**
 * Returns goal data strictly matching the requested id or slug.
 * ZERO cross-goal fallback: returns null if not matched.
 */
export const getGoalDataByIdOrSlug = (idOrSlugOrObj, allGoals = []) => {
  if (!idOrSlugOrObj) return null;

  const query = typeof idOrSlugOrObj === 'object'
    ? (idOrSlugOrObj.slug || idOrSlugOrObj._id || idOrSlugOrObj.goalId)
    : idOrSlugOrObj;

  if (!query) return null;

  const canonical = resolveCanonicalGoalSlug(query);
  if (GOAL_REGISTRY[canonical]) {
    return GOAL_REGISTRY[canonical];
  }

  // If it's an ID, find the goal in allGoals by _id to get its slug
  const matched = allGoals.find(g => g._id === query || g.slug === query);
  if (matched) {
    const matchedCanonical = resolveCanonicalGoalSlug(matched.slug);
    if (GOAL_REGISTRY[matchedCanonical]) {
      return GOAL_REGISTRY[matchedCanonical];
    }
  }

  return null;
};
