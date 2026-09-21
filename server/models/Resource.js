import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
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
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: [
      'youtube_playlist',
      'youtube_video',
      'doc',
      'course_free',
      'course_paid',
      'book',
      'practice_platform',
      'project',
      'mock_test',
      'article'
    ],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'beginner',
  },
  provider: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.8,
  },
  reviewsCount: {
    type: Number,
    default: 120,
  },
  estimatedHours: {
    type: Number,
    default: 5,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }]
}, {
  timestamps: true
});

resourceSchema.index({ goalId: 1, stageNumber: 1, topicTitle: 1 });

export default mongoose.model('Resource', resourceSchema);
