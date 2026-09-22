import jeeData from './goals/jee-mains-advanced.json';
import fullStackData from './goals/full-stack-development.json';

export const DEFAULT_GOAL_SLUG = 'jee-mains-advanced';

export const GOAL_REGISTRY = {
  'jee-mains-advanced': jeeData,
  'full-stack-development': fullStackData,
};

export const PREDEFINED_GOALS = [
  jeeData.goal,
  fullStackData.goal,
];

export const getGoalDataBySlug = (slug) => {
  if (!slug) return GOAL_REGISTRY[DEFAULT_GOAL_SLUG];
  return GOAL_REGISTRY[slug] || GOAL_REGISTRY[DEFAULT_GOAL_SLUG];
};

export const getGoalDataByIdOrSlug = (idOrSlugOrObj, allGoals = []) => {
  if (!idOrSlugOrObj) return GOAL_REGISTRY[DEFAULT_GOAL_SLUG];
  
  const query = typeof idOrSlugOrObj === 'object'
    ? (idOrSlugOrObj.slug || idOrSlugOrObj._id || idOrSlugOrObj.goalId)
    : idOrSlugOrObj;

  if (query && GOAL_REGISTRY[query]) {
    return GOAL_REGISTRY[query];
  }

  // If it's an ID, find the goal in allGoals by _id to get its slug
  const matched = allGoals.find(g => g._id === query || g.slug === query);
  if (matched && GOAL_REGISTRY[matched.slug]) {
    return GOAL_REGISTRY[matched.slug];
  }

  return GOAL_REGISTRY[DEFAULT_GOAL_SLUG];
};
