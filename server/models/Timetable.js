import mongoose from 'mongoose';

const scheduleBlockSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, required: true }, // e.g., "09:00 AM"
  endTime: { type: String, required: true },   // e.g., "10:30 AM"
  durationMinutes: { type: Number, required: true },
  title: { type: String, required: true },
  blockType: {
    type: String,
    enum: ['study', 'practice', 'review', 'project', 'break'],
    default: 'study',
  },
  stageNumber: { type: Number, default: 1 },
  topicTitle: { type: String, default: '' },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  }
});

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGoal',
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  weekStartDate: {
    type: String, // YYYY-MM-DD representing start of the active week
    required: true,
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  }],
  dailyHours: {
    type: Number,
    default: 2,
  },
  preferredSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'],
    default: 'morning',
  },
  includeBreaks: {
    type: Boolean,
    default: true,
  },
  blocks: [scheduleBlockSchema]
}, {
  timestamps: true
});

export default mongoose.model('Timetable', timetableSchema);
