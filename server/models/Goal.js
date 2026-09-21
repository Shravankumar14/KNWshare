import mongoose from 'mongoose';

const careerPathStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  milestones: [{ type: String }],
  icon: { type: String, default: 'Compass' }
});

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['web_dev', 'ai_ml', 'competitive_programming', 'engineering_exams', 'cloud_devops', 'data_science', 'custom'],
    default: 'web_dev',
  },
  tagline: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'Target',
  },
  badgeColor: {
    type: String,
    default: 'blue',
  },
  estimatedMonths: {
    type: Number,
    default: 6,
  },
  targetRoles: [{
    type: String
  }],
  careerPath: [careerPathStepSchema],
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
}, {
  timestamps: true
});

export default mongoose.model('Goal', goalSchema);
