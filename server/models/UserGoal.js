import mongoose from 'mongoose';

const userGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  targetDate: {
    type: Date,
    required: true,
  },
  hoursPerDay: {
    type: Number,
    required: true,
    min: 0.5,
    max: 16,
    default: 2,
  },
  hoursPerWeek: {
    type: Number,
    default: 14,
  },
  currentKnowledge: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  completedStages: [{
    type: Number,
  }],
  completedTopics: [{
    type: String,
  }],
  selectedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  }],
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  }
}, {
  timestamps: true
});

userGoalSchema.index({ userId: 1, goalId: 1 }, { unique: true });

export default mongoose.model('UserGoal', userGoalSchema);
