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

const getDayDate = (dayOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

export const generateWeeklyTimetable = async ({
  userId,
  userGoalId,
  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  dailyHours = 2,
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

  // Determine current active stage
  const completedStageNumbers = userGoal.completedStages || [];
  const currentStage = roadmap.stages.find(s => !completedStageNumbers.includes(s.stageNumber)) || roadmap.stages[0];

  const topicsPool = currentStage.topics && currentStage.topics.length > 0 
    ? currentStage.topics 
    : [{ title: `${userGoal.goalId.title} Core Study`, practiceTasks: ['Read concepts', 'Hands-on practice'] }];

  const weekStartDate = new Date().toISOString().split('T')[0];

  // Remove existing timetable for this goal
  await Timetable.deleteMany({ userId, userGoalId });

  const blocks = [];
  const generatedTasks = [];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayIndex = new Date().getDay();

  // Create schedule blocks for each selected available day
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

    // Split daily hours into realistic sessions: e.g. 45-60 min study + 15 min break + 45-60 min practice
    const session1Duration = dailyHours >= 2 ? 60 : Math.round(dailyHours * 60);
    const session1EndMinute = currentMinute + session1Duration;
    const s1EndHour = currentHour + Math.floor(session1EndMinute / 60);
    const s1FinalMin = session1EndMinute % 60;

    const topic1 = topicsPool[topicIndex % topicsPool.length];
    topicIndex++;

    const block1 = {
      dayOfWeek: dayName,
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(s1EndHour, s1FinalMin),
      durationMinutes: session1Duration,
      title: `${topic1.title}: Concept Mastery`,
      blockType: 'study',
      stageNumber: currentStage.stageNumber,
      topicTitle: topic1.title
    };

    // Create synchronized task
    const task1 = await Task.create({
      userId,
      userGoalId,
      goalId: userGoal.goalId._id,
      stageNumber: currentStage.stageNumber,
      topicTitle: topic1.title,
      title: `Study: ${topic1.title} Concepts`,
      description: `Deep dive into ${topic1.title}. Understand fundamental theory, syntax, and principles.`,
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

    // If student has 2 or more hours, add a buffer break and practice block
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
          stageNumber: currentStage.stageNumber,
          topicTitle: 'Rest'
        });

        currentHour = breakEndHour;
        currentMinute = breakFinalMin;
      } else {
        currentHour = s1EndHour;
        currentMinute = s1FinalMin;
      }

      // Practice / Problem Solving Block
      const session2Duration = Math.round((dailyHours - 1) * 60);
      const session2EndMinute = currentMinute + session2Duration;
      const s2EndHour = currentHour + Math.floor(session2EndMinute / 60);
      const s2FinalMin = session2EndMinute % 60;

      const block2 = {
        dayOfWeek: dayName,
        startTime: formatTime(currentHour, currentMinute),
        endTime: formatTime(s2EndHour, s2FinalMin),
        durationMinutes: session2Duration,
        title: `${topic1.title}: Hands-on Practice`,
        blockType: 'practice',
        stageNumber: currentStage.stageNumber,
        topicTitle: topic1.title
      };

      const task2 = await Task.create({
        userId,
        userGoalId,
        goalId: userGoal.goalId._id,
        stageNumber: currentStage.stageNumber,
        topicTitle: topic1.title,
        title: `Practice & Exercises: ${topic1.title}`,
        description: `Solve exercises and build miniature implementations for ${topic1.title}.`,
        date: dateStr,
        startTime: block2.startTime,
        endTime: block2.endTime,
        durationMinutes: session2Duration,
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
