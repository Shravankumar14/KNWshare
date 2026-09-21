import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  subtopics: [{ type: String }],
  skills: [{ type: String }],
  importance: { type: String, enum: ['high', 'medium', 'optional'], default: 'high' },
  estimatedHours: { type: Number, default: 10 },
  practiceTasks: [{ type: String }]
});

const roadmapStageSchema = new mongoose.Schema({
  stageNumber: { type: Number, required: true },
  title: { type: String, required: true },
  shortSummary: { type: String, default: '' },
  estimatedHours: { type: Number, required: true },
  dependencies: [{ type: Number }], // Previous stage numbers that must precede this
  topics: [topicSchema],
  milestoneOutcome: { type: String, default: '' }
});

const roadmapSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalEstimatedHours: {
    type: Number,
    default: 200,
  },
  stages: [roadmapStageSchema]
}, {
  timestamps: true
});

export default mongoose.model('Roadmap', roadmapSchema);
