import mongoose from 'mongoose';

const roadmapStageSchema = new mongoose.Schema({
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
    index: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    index: true,
  },
  stageNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapStage',
  }],
  estimatedHours: {
    type: Number,
    default: 20,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  learningObjectives: [{
    type: String,
  }],
  practiceRequirements: [{
    type: String,
  }],
  skippableIfExperienced: {
    type: Boolean,
    default: false,
  },
  subject: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

roadmapStageSchema.index({ roadmapId: 1, order: 1 });
roadmapStageSchema.index({ goalId: 1, stageNumber: 1 });

export default mongoose.model('RoadmapStage', roadmapStageSchema);
