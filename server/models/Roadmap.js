import mongoose from 'mongoose';

const topicResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  subject: { type: String },
  topic: { type: String },
  resourceType: { type: String, default: 'concept_video' },
  url: { type: String, required: true },
  isFree: { type: Boolean, default: true },
  examLevel: { type: String, default: 'Both Main & Advanced' },
  description: { type: String, default: '' }
}, { _id: false });

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String }, // Physics | Chemistry | Mathematics
  description: { type: String, default: '' },
  subtopics: [{ type: String }],
  skills: [{ type: String }],
  prerequisites: [{ type: String }], // e.g. ['Vectors', 'Basic Calculus']
  importance: { type: String, enum: ['high', 'medium', 'optional'], default: 'high' },
  estimatedHours: { type: Number, default: 10 },
  jeeMainRelevance: { type: String, default: '' },
  jeeAdvancedRelevance: { type: String, default: '' },
  learningSteps: [{
    stepKey: { type: String }, // 'learn' | 'understand' | 'practice' | 'main_pyq' | 'adv_problem' | 'revision' | 'test'
    title: { type: String },
    completed: { type: Boolean, default: false }
  }],
  jeeMainLayer: [{ type: String }],
  jeeAdvancedLayer: [{ type: String }],
  practiceTasks: [{ type: String }],
  resources: [topicResourceSchema]
});

const roadmapStageSchema = new mongoose.Schema({
  stageNumber: { type: Number, required: true },
  subject: { type: String }, // Physics | Chemistry | Mathematics
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
  },
  slug: {
    type: String,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: '1.0.0',
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
