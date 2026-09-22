import Timetable from '../models/Timetable.js';
import Task from '../models/Task.js';
import Roadmap from '../models/Roadmap.js';
import UserGoal from '../models/UserGoal.js';

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

  const roadmap = await Roadmap.findOne({ goalId: userGoal.goalId._id });
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
    const maxTopics = Math.max(...subjectStages.map(s => (s.topics || []).length));
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
        subject: null
      };
    });
  }

  if (topicsPool.length === 0) {
    topicsPool = [{
      title: `${userGoal.goalId.title} Core Study`,
      stageNumber: 1,
      subject: null,
      practiceTasks: ['Read theory & concepts', 'Solve standard exercises']
    }];
  }

  const weekStartDate = new Date().toISOString().split('T')[0];

  // Remove existing timetable and upcoming auto-generated tasks for this goal
  await Timetable.deleteMany({ userId, userGoalId });

  const blocks = [];
  const generatedTasks = [];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let topicIndex = 0;

  for (let i = 0; i < 7; i++) {
    const calendarDate = new Date();
    calendarDate.setDate(calendarDate.getDate() + i);
    const dayName = daysOfWeek[calendarDate.getDay()];
    const dateStr = calendarDate.toISOString().split('T')[0];

    if (!availableDays.includes(dayName)) continue;

    const startHour = getSlotStartHour(preferredSlot);
    let currentHour = startHour;
    let currentMinute = 0;

    // First Session: Concepts / Learning (60-90 min)
    const session1Duration = dailyHours >= 3 ? 90 : (dailyHours >= 2 ? 60 : Math.round(dailyHours * 60));
    const session1EndMinute = currentMinute + session1Duration;
    const s1EndHour = currentHour + Math.floor(session1EndMinute / 60);
    const s1FinalMin = session1EndMinute % 60;

    const topic1 = topicsPool[topicIndex % topicsPool.length];
    topicIndex++;

    const subjectPrefix = topic1.subject ? `${topic1.subject}: ` : '';

    const block1 = {
      dayOfWeek: dayName,
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(s1EndHour, s1FinalMin),
      durationMinutes: session1Duration,
      title: `${subjectPrefix}${topic1.title} (Concepts & Theory)`,
      blockType: 'study',
      stageNumber: topic1.stageNumber,
      topicTitle: topic1.title
    };

    const task1 = await Task.create({
      userId,
      userGoalId,
      goalId: userGoal.goalId._id,
      stageNumber: topic1.stageNumber,
      topicTitle: topic1.title,
      title: `Study: ${subjectPrefix}${topic1.title}`,
      description: `Understand fundamental definitions, derivations, and formulas for ${topic1.title}.`,
      date: dateStr,
      startTime: block1.startTime,
      endTime: block1.endTime,
      durationMinutes: session1Duration,
      priority: 'high',
      status: 'pending',
      originalDate: dateStr
    });

    block1.taskId = task1._id;
    blocks.push(block1);
    generatedTasks.push(task1);

    // If student has 2 or more hours, schedule breaks and practice
    if (dailyHours >= 2) {
      // Break Block (15 mins)
      if (includeBreaks) {
        const breakStartHour = s1EndHour;
        const breakStartMin = s1FinalMin;
        const breakEndMinTotal = breakStartMin + 15;
        const breakEndHour = breakStartHour + Math.floor(breakEndMinTotal / 60);
        const breakFinalMin = breakEndMinTotal % 60;

        blocks.push({
          dayOfWeek: dayName,
          startTime: formatTime(breakStartHour, breakStartMin),
          endTime: formatTime(breakEndHour, breakFinalMin),
          durationMinutes: 15,
          title: 'Mind Refresh & Hydration Break',
          blockType: 'break',
          stageNumber: topic1.stageNumber,
          topicTitle: 'Rest'
        });

        currentHour = breakEndHour;
        currentMinute = breakFinalMin;
      } else {
        currentHour = s1EndHour;
        currentMinute = s1FinalMin;
      }

      // Session 2: Practice & PYQs (60-90 min)
      const session2Duration = Math.round((dailyHours * 60) - session1Duration - (includeBreaks ? 15 : 0));
      const s2DurationFinal = Math.max(session2Duration, 45);
      const session2EndMinute = currentMinute + s2DurationFinal;
      const s2EndHour = currentHour + Math.floor(session2EndMinute / 60);
      const s2FinalMin = session2EndMinute % 60;

      // In multi-subject curriculum, pick next subject for afternoon/evening practice!
      const topic2 = isMultiSubject ? topicsPool[topicIndex % topicsPool.length] : topic1;
      if (isMultiSubject) topicIndex++;

      const subject2Prefix = topic2.subject ? `${topic2.subject}: ` : '';

      const block2 = {
        dayOfWeek: dayName,
        startTime: formatTime(currentHour, currentMinute),
        endTime: formatTime(s2EndHour, s2FinalMin),
        durationMinutes: s2DurationFinal,
        title: `${subject2Prefix}${topic2.title} (Practice & PYQs)`,
        blockType: 'practice',
        stageNumber: topic2.stageNumber,
        topicTitle: topic2.title
      };

      const task2 = await Task.create({
        userId,
        userGoalId,
        goalId: userGoal.goalId._id,
        stageNumber: topic2.stageNumber,
        topicTitle: topic2.title,
        title: `Solve: ${subject2Prefix}${topic2.title} Problems & PYQs`,
        description: `Solve 15-20 timed problems and previous year questions (PYQs) for ${topic2.title}.`,
        date: dateStr,
        startTime: block2.startTime,
        endTime: block2.endTime,
        durationMinutes: s2DurationFinal,
        priority: 'medium',
        status: 'pending',
        originalDate: dateStr
      });

      block2.taskId = task2._id;
      blocks.push(block2);
      generatedTasks.push(task2);
    }
  }

  const timetable = await Timetable.create({
    userId,
    userGoalId,
    goalId: userGoal.goalId._id,
    weekStartDate,
    availableDays,
    dailyHours,
    preferredSlot,
    includeBreaks,
    blocks
  });

  return { timetable, tasks: generatedTasks };
};
