import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher creator reference is required'],
    index: true,
  },
  mediaUrl: {
    type: String,
    required: [true, 'Media URL for story is required'],
    trim: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  text: {
    type: String,
    default: '',
    trim: true,
  },
  badge: {
    type: String,
    default: 'SPARK',
    trim: true,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  slotAction: {
    type: String,
    default: 'Book 1-on-1 Slot',
  },
  externalLink: {
    url: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  published: {
    type: Boolean,
    default: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Ephemeral 24h standard lifetime
    index: true,
  },
}, {
  timestamps: true,
});

storySchema.index({ published: 1, expiresAt: 1, createdAt: -1 });

export default mongoose.model('Story', storySchema);
