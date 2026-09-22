import mongoose from 'mongoose';

const userGoalProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
    index: true,
  },
  goalSlug: {
    type: String,
    index: true,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  hoursPerDay: {
    type: Number,
    default: 2,
    min: 0.5,
    max: 16,
  },
  daysPerWeek: {
    type: Number,
    default: 6,
    min: 1,
    max: 7,
  },
  targetTimelineWeeks: {
    type: Number,
    default: 24,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active',
  }
}, {
  timestamps: true,
});

userGoalProfileSchema.index({ userId: 1, goalId: 1 }, { unique: true });

export default mongoose.model('UserGoalProfile', userGoalProfileSchema);
