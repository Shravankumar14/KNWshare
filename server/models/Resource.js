import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  // New Relational References (§3.3 & §3.4)
  goalIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  }],
  stageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapStage',
  }],
  topicIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapTopic',
  }],

  // Backward compatibility fields for existing data
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    index: true,
  },
  stageNumber: {
    type: Number,
  },
  topicTitle: {
    type: String,
    trim: true,
  },

  // Core metadata
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  provider: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: [
      // Standard enum (§3.3)
      'video',
      'playlist',
      'notes',
      'documentation',
      'book',
      'website',
      'practice',
      'pyq',
      'course',
      'tool',
      'other',
      // Legacy enum compatibility
      'youtube_playlist',
      'youtube_video',
      'doc',
      'course_free',
      'course_paid',
      'practice_platform',
      'project',
      'mock_test',
      'article'
    ],
    default: 'video',
  },
  free: {
    type: Boolean,
    default: true,
  },
  // Backward compatibility alias for free
  isFree: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  sourceType: {
    type: String,
    enum: ['external', 'platform', 'teacher'],
    default: 'external',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'beginner',
  },
  examLevel: {
    type: String,
    default: 'Both Main & Advanced',
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
  tags: [{
    type: String,
  }]
}, {
  timestamps: true,
});

// Middleware to sync boolean aliases and single/array goal references
resourceSchema.pre('save', function (next) {
  if (this.free === undefined && this.isFree !== undefined) {
    this.free = this.isFree;
  }
  if (this.isFree === undefined && this.free !== undefined) {
    this.isFree = this.free;
  }
  if (this.verified === undefined && this.isVerified !== undefined) {
    this.verified = this.isVerified;
  }
  if (this.isVerified === undefined && this.verified !== undefined) {
    this.isVerified = this.verified;
  }
  if (this.goalId && (!this.goalIds || this.goalIds.length === 0)) {
    this.goalIds = [this.goalId];
  }
  next();
});

// Compound indexes required by §3.4
resourceSchema.index({ topicIds: 1 });
resourceSchema.index({ stageIds: 1 });
resourceSchema.index({ goalIds: 1, type: 1, free: 1 });
resourceSchema.index({ goalId: 1, stageNumber: 1, topicTitle: 1 });

export default mongoose.model('Resource', resourceSchema);
