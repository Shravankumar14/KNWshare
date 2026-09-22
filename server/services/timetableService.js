import Timetable from '../models/Timetable.js';
import Task from '../models/Task.js';
import Roadmap from '../models/Roadmap.js';
import UserGoal from '../models/UserGoal.js';
import { getOrProvisionRoadmap } from './roadmapService.js';

// Helper to convert slot preference to default start hour
const getSlotStartHour = (preferredSlot) => {
  switch (preferredSlot) {
    case 'morning': return 9; // 09:00 AM
    case 'afternoon': return 14; // 02:00 PM
    case 'evening': return 18; // 06:00 PM
    case 'night': return 21; // 09:00 PM
    default: return 10;
  }
};

const formatTime = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  return `${displayHour}:${displayMinute} ${period}`;
};

export const generateWeeklyTimetable = async ({
  userId,
  userGoalId,
  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dailyHours = 3,
  preferredSlot = 'morning',
  includeBreaks = true
}) => {
  const userGoal = await UserGoal.findById(userGoalId).populate('goalId');
  if (!userGoal) {
    throw new Error('User goal not found');
  }

  // Use getOrProvisionRoadmap to resolve by goalId, slug, or provision from disk
  const goalIdentifier = userGoal.goalId?._id || userGoal.goalId?.slug || userGoal.goalId;
  const roadmap = await getOrProvisionRoadmap(goalIdentifier);

  if (!roadmap || !roadmap.stages || roadmap.stages.length === 0) {
    throw new Error('No roadmap found for the selected goal');
  }

  const completedStageNumbers = userGoal.completedStages || [];

  // Check if this is a multi-subject curriculum like JEE Mains & Advanced
  const isMultiSubject = roadmap.stages.some(s => s.subject);
  let topicsPool = [];

  if (isMultiSubject) {
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const subjectStages = subjects.map(sub => {
      const stagesForSub = roadmap.stages.filter(s => s.subject === sub);
      return stagesForSub.find(s => !completedStageNumbers.includes(s.stageNumber)) || stagesForSub[0];
    }).filter(Boolean);

    // Interleave topics from Physics, Chemistry, and Mathematics in cyclical sequence
    const maxTopics = Math.max(...subjectStages.map(s => (s.topics || []).length), 1);
    for (let t = 0; t < maxTopics; t++) {
      subjectStages.forEach(s => {
        if (s.topics && s.topics[t]) {
          const raw = s.topics[t].toObject ? s.topics[t].toObject() : s.topics[t];
          topicsPool.push({
            ...raw,
            stageNumber: s.stageNumber,
            subject: s.subject
          });
        }
      });
    }
  } else {
    const currentStage = roadmap.stages.find(s => !completedStageNumbers.includes(s.stageNumber)) || roadmap.stages[0];
    topicsPool = (currentStage.topics || []).map(t => {
      const raw = t.toObject ? t.toObject() : t;
      return {
        ...raw,
        stageNumber: currentStage.stageNumber,
      };
    });
  }

  // If topics pool is still empty, populate fallback topics from all stages
  if (topicsPool.length === 0) {
    roadmap.stages.forEach(s => {
      (s.topics || []).forEach(t => {
        const raw = t.toObject ? t.toObject() : t;
        topicsPool.push({
          ...raw,
          stageNumber: s.stageNumber,
          subject: s.subject
        });
      });
    });
  }

  const studyBlockMinutes = 60; // 1 hour focused sprint
  const breakMinutes = 15;

  let topicIndex = 0;
  const blocks = [];
  const createdTasks = [];

  // Clear previous pending timetable tasks for this goal
  await Task.deleteMany({
    userId,
    userGoalId,
    status: 'pending'
  });

  // Calculate current week Monday date
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() + diffToMonday);

  const daysMap = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
  };

  for (const day of availableDays) {
    const dayOffset = daysMap[day] ?? 0;
    const blockDate = new Date(mondayDate);
    blockDate.setDate(mondayDate.getDate() + dayOffset);
    const dateStr = blockDate.toISOString().split('T')[0];

    const startHour = getSlotStartHour(preferredSlot);
    let currentMinutes = startHour * 60;
    const dailyTargetMinutes = dailyHours * 60;
    let accumulatedMinutes = 0;

    while (accumulatedMinutes + studyBlockMinutes <= dailyTargetMinutes && topicsPool.length > 0) {
      const currentTopic = topicsPool[topicIndex % topicsPool.length];
      topicIndex++;

      const isPractice = (accumulatedMinutes / studyBlockMinutes) % 2 === 1;
      const type = isPractice ? 'practice' : 'study';

      const startH = Math.floor(currentMinutes / 60);
      const startM = currentMinutes % 60;
      const endMinutes = currentMinutes + studyBlockMinutes;
      const endH = Math.floor(endMinutes / 60);
      const endM = endMinutes % 60;

      const subjectPrefix = currentTopic.subject ? `[${currentTopic.subject}] ` : '';
      const taskTitle = isPractice
        ? `${subjectPrefix}Practice: ${currentTopic.title}`
        : `${subjectPrefix}Study: ${currentTopic.title}`;

      const taskDescription = isPractice
        ? `Solve standard & PYQ problems for ${currentTopic.title}. Focus on formula application and accuracy.`
        : `Deep dive into concepts, derivations and NCERT/notes for ${currentTopic.title}.`;

      // Create Task document in MongoDB
      const task = await Task.create({
        userId,
        userGoalId,
        goalId: userGoal.goalId._id || userGoal.goalId,
        stageNumber: currentTopic.stageNumber,
        topicTitle: currentTopic.title,
        title: taskTitle,
        description: taskDescription,
        date: dateStr,
        startTime: formatTime(startH, startM),
        endTime: formatTime(endH, endM),
        durationMinutes: studyBlockMinutes,
        priority: currentTopic.importance === 'high' ? 'high' : 'medium',
        status: 'pending'
      });

      createdTasks.push(task);

      // Push to timetable blocks
      blocks.push({
        dayOfWeek: day,
        startTime: formatTime(startH, startM),
        endTime: formatTime(endH, endM),
        durationMinutes: studyBlockMinutes,
        type,
        stageNumber: currentTopic.stageNumber,
        topicTitle: currentTopic.title,
        title: taskTitle,
        description: taskDescription,
        taskId: task._id
      });

      currentMinutes = endMinutes;
      accumulatedMinutes += studyBlockMinutes;

      // Add rest break if enabled and remaining time allows
      if (includeBreaks && accumulatedMinutes + breakMinutes + studyBlockMinutes <= dailyTargetMinutes) {
        const bStartH = Math.floor(currentMinutes / 60);
        const bStartM = currentMinutes % 60;
        const bEndMinutes = currentMinutes + breakMinutes;
        const bEndH = Math.floor(bEndMinutes / 60);
        const bEndM = bEndMinutes % 60;

        blocks.push({
          dayOfWeek: day,
          startTime: formatTime(bStartH, bStartM),
          endTime: formatTime(bEndH, bEndM),
          durationMinutes: breakMinutes,
          type: 'break',
          title: 'Rest & Mental Reset',
          description: 'Hydrate, stretch, step away from screens for peak cognitive retention.'
        });

        currentMinutes = bEndMinutes;
        accumulatedMinutes += breakMinutes;
      }
    }
  }

  // Save or replace active timetable in MongoDB
  const timetable = await Timetable.findOneAndUpdate(
    { userId, userGoalId },
    {
      userId,
      userGoalId,
      availableDays,
      dailyHours,
      preferredSlot,
      includeBreaks,
      totalWeeklyHours: Math.round((blocks.filter(b => b.type !== 'break').length * studyBlockMinutes) / 60),
      blocks
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { timetable, tasks: createdTasks };
};
