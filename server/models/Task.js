import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
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
  stageNumber: {
    type: Number,
    required: true,
  },
  topicTitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: String, // YYYY-MM-DD for easy day comparisons
    required: true,
  },
  startTime: {
    type: String, // e.g. "10:00 AM"
    default: '10:00 AM',
  },
  endTime: {
    type: String, // e.g. "11:30 AM"
    default: '11:30 AM',
  },
  durationMinutes: {
    type: Number,
    default: 60,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    default: null,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'rescheduled'],
    default: 'pending',
  },
  originalDate: {
    type: String, // Tracks initial scheduled date before any rescheduling
  },
  rescheduleCount: {
    type: Number,
    default: 0,
  },
  rescheduleReason: {
    type: String,
    default: '',
  },
  completedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

taskSchema.index({ userId: 1, date: 1, status: 1 });

export default mongoose.model('Task', taskSchema);
