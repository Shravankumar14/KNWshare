import mongoose from 'mongoose';

const roadmapTopicSchema = new mongoose.Schema({
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapStage',
    required: true,
    index: true,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    index: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    index: true,
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
    ref: 'RoadmapTopic',
  }],
  estimatedHours: {
    type: Number,
    default: 5,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  skills: [{
    type: String,
  }],
  subtopics: [{
    type: String,
  }],
  subject: {
    type: String,
    default: '',
  },
  importance: {
    type: String,
    enum: ['high', 'medium', 'optional'],
    default: 'high',
  }
}, {
  timestamps: true,
});

roadmapTopicSchema.index({ stageId: 1, order: 1 });
roadmapTopicSchema.index({ goalId: 1, title: 1 });

export default mongoose.model('RoadmapTopic', roadmapTopicSchema);
