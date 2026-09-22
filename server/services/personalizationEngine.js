/**
 * Deterministic Personalization Engine (§6)
 *
 * Implements deterministic topological graph sorting and timeline scheduling
 * based on the roadmap dependency graph, student availability (hours/day, days/week),
 * expertise level, and topic completion progress.
 */

/**
 * Topologically sorts topics respecting their prerequisites.
 * Preserves stage and topic order as secondary stable key.
 */
export const topologicalSortTopics = (topics) => {
  const topicMap = new Map();
  const inDegree = new Map();
  const adj = new Map();

  // Initialize
  topics.forEach((t) => {
    const idStr = t._id ? t._id.toString() : t.title;
    topicMap.set(idStr, t);
    inDegree.set(idStr, 0);
    adj.set(idStr, []);
  });

  // Build dependency edges
  topics.forEach((t) => {
    const idStr = t._id ? t._id.toString() : t.title;
    const prereqs = t.prerequisites || [];
    prereqs.forEach((prereq) => {
      const prereqId = prereq._id ? prereq._id.toString() : prereq.toString();
      if (topicMap.has(prereqId)) {
        adj.get(prereqId).push(idStr);
        inDegree.set(idStr, (inDegree.get(idStr) || 0) + 1);
      }
    });
  });

  // Kahn's Algorithm with stable stage/order queue
  const queue = [];
  topics.forEach((t) => {
    const idStr = t._id ? t._id.toString() : t.title;
    if (inDegree.get(idStr) === 0) {
      queue.push(t);
    }
  });

  // Sort queue by stageNumber and order to ensure logical pedagogical sequence
  queue.sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0) || (a.order || 0) - (b.order || 0));

  const sorted = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);
    const currentId = current._id ? current._id.toString() : current.title;

    const neighbors = adj.get(currentId) || [];
    for (const neighborId of neighbors) {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) {
        const nextTopic = topicMap.get(neighborId);
        if (nextTopic) {
          queue.push(nextTopic);
          queue.sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0) || (a.order || 0) - (b.order || 0));
        }
      }
    }
  }

  // Fallback for any unvisited topics (cycles or disconnected nodes)
  if (sorted.length < topics.length) {
    topics.forEach((t) => {
      const idStr = t._id ? t._id.toString() : t.title;
      if (!sorted.some((s) => (s._id ? s._id.toString() : s.title) === idStr)) {
        sorted.push(t);
      }
    });
  }

  return sorted;
};

/**
 * Computes deterministic pacing and returns a week-by-week personalized schedule.
 *
 * @param {Object} params
 * @param {Object} params.userGoalProfile { level, hoursPerDay, daysPerWeek, targetTimelineWeeks }
 * @param {Array} params.stages List of RoadmapStages with embedded or populated topics
 * @param {Array} params.completedTopicIds Set/Array of completed topic IDs or topic titles
 * @param {Array} params.resources Available resources for the goal
 */
export const calculatePersonalizedPacing = ({
  userGoalProfile = {},
  stages = [],
  completedTopicIds = [],
  resources = []
}) => {
  const level = userGoalProfile.level || 'beginner';
  const hoursPerDay = Math.max(0.5, userGoalProfile.hoursPerDay || 2);
  const daysPerWeek = Math.min(7, Math.max(1, userGoalProfile.daysPerWeek || 6));
  const weeklyAvailableHours = hoursPerDay * daysPerWeek;

  const completedSet = new Set(
    (completedTopicIds || []).map((id) => (id ? id.toString() : ''))
  );

  // 1. Flatten all topics with stage metadata
  const allTopics = [];
  stages.forEach((stage, sIdx) => {
    // If user is intermediate/advanced and stage is skippable, mark skippable
    const isStageSkippable =
      (level === 'intermediate' || level === 'advanced') && stage.skippableIfExperienced;

    (stage.topics || []).forEach((topic, tIdx) => {
      const topicIdStr = topic._id ? topic._id.toString() : `${stage.stageNumber || sIdx + 1}:${topic.title}`;
      const isCompleted = completedSet.has(topicIdStr) || completedSet.has(topic.title) || completedSet.has(`${stage.stageNumber || sIdx + 1}:${topic.title}`);

      // If experienced and stage is skippable, compress estimated hours by 50% or skip
      let effHours = topic.estimatedHours || 6;
      if (isStageSkippable) {
        effHours = Math.max(1, Math.round(effHours * 0.4)); // compressed review hours
      }

      allTopics.push({
        ...topic,
        _id: topic._id || topicIdStr,
        stageId: stage._id,
        stageNumber: stage.stageNumber || sIdx + 1,
        stageTitle: stage.title,
        stageOrder: stage.order || sIdx + 1,
        order: topic.order || tIdx + 1,
        estimatedHours: effHours,
        originalHours: topic.estimatedHours || 6,
        isCompleted,
        isStageSkippable,
        subject: topic.subject || stage.subject || 'General'
      });
    });
  });

  // 2. Sort topics topologically
  const sortedTopics = topologicalSortTopics(allTopics);

  // 3. Calculate hours
  const totalRoadmapHours = allTopics.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completedHours = allTopics
    .filter((t) => t.isCompleted)
    .reduce((sum, t) => sum + t.estimatedHours, 0);
  const remainingHours = Math.max(0, totalRoadmapHours - completedHours);

  // 4. Determine Timeline Weeks
  let targetTimelineWeeks = userGoalProfile.targetTimelineWeeks;
  if (!targetTimelineWeeks || targetTimelineWeeks <= 0) {
    targetTimelineWeeks = Math.max(1, Math.ceil(remainingHours / weeklyAvailableHours));
  }

  // 5. Index resources by topicId, topicTitle, and stageNumber
  const resourceMap = new Map();
  resources.forEach((r) => {
    // Topic ids
    (r.topicIds || []).forEach((tId) => {
      const key = tId ? tId.toString() : '';
      if (!resourceMap.has(key)) resourceMap.set(key, []);
      resourceMap.get(key).push(r);
    });
    // Topic title
    if (r.topicTitle) {
      if (!resourceMap.has(r.topicTitle)) resourceMap.set(r.topicTitle, []);
      resourceMap.get(r.topicTitle).push(r);
    }
  });

  // 6. Distribute topics into weeks
  const weeks = [];
  let currentWeekNumber = 1;
  let currentWeekHours = 0;
  let currentWeekTopics = [];

  for (const topic of sortedTopics) {
    const topicResources = [
      ...(resourceMap.get(topic._id ? topic._id.toString() : '') || []),
      ...(resourceMap.get(topic.title) || []),
      ...((topic.resources || []).map((res) => ({
        ...res,
        sourceType: 'platform',
        verified: true
      })))
    ];

    // Deduplicate resources by URL
    const uniqueResources = Array.from(
      new Map(topicResources.map((item) => [item.url, item])).values()
    );

    const enrichedTopic = {
      ...topic,
      resources: uniqueResources
    };

    // If adding this topic exceeds weekly hours and we already have topics in current week, advance to next week
    if (currentWeekHours + topic.estimatedHours > weeklyAvailableHours && currentWeekTopics.length > 0) {
      weeks.push({
        weekNumber: currentWeekNumber,
        plannedHours: currentWeekHours,
        capacityHours: weeklyAvailableHours,
        isCompleted: currentWeekTopics.every((t) => t.isCompleted),
        topics: currentWeekTopics
      });

      currentWeekNumber++;
      currentWeekHours = 0;
      currentWeekTopics = [];
    }

    currentWeekTopics.push(enrichedTopic);
    currentWeekHours += topic.estimatedHours;
  }

  // Push remaining week
  if (currentWeekTopics.length > 0) {
    weeks.push({
      weekNumber: currentWeekNumber,
      plannedHours: currentWeekHours,
      capacityHours: weeklyAvailableHours,
      isCompleted: currentWeekTopics.every((t) => t.isCompleted),
      topics: currentWeekTopics
    });
  }

  return {
    summary: {
      level,
      hoursPerDay,
      daysPerWeek,
      weeklyAvailableHours,
      totalRoadmapHours,
      completedHours,
      remainingHours,
      completionPercentage: totalRoadmapHours > 0 ? Math.round((completedHours / totalRoadmapHours) * 100) : 0,
      estimatedWeeksNeeded: Math.max(1, Math.ceil(remainingHours / weeklyAvailableHours)),
      targetTimelineWeeks
    },
    weeks
  };
};
