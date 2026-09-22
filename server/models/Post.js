import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher creator reference is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  text: {
    type: String,
    required: [true, 'Post description or body text is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  externalLink: {
    url: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  goalSlug: {
    type: String,
    default: '',
    index: true,
  },
  published: {
    type: Boolean,
    default: true,
    index: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  discussionsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

postSchema.index({ published: 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);
