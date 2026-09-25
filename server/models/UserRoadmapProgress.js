import mongoose from 'mongoose';

const userRoadmapProgressSchema = new mongoose.Schema({
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
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapTopic',
    index: true,
  },
  stageNumber: {
    type: Number,
    index: true,
  },
  topicTitle: {
    type: String,
    index: true,
  },
  topicKey: {
    type: String, // e.g. "1:Vectors & Kinematics"
    index: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
    index: true,
  },
  completedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

userRoadmapProgressSchema.index({ userId: 1, goalId: 1, topicId: 1 });
userRoadmapProgressSchema.index({ userId: 1, goalId: 1, topicKey: 1 });

export default mongoose.model('UserRoadmapProgress', userRoadmapProgressSchema);
