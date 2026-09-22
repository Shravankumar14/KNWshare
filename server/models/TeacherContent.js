import mongoose from 'mongoose';

const teacherContentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  teacherProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherProfile'
  },
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  goalSlug: {
    type: String,
    default: 'jee-mains-advanced',
    index: true
  },
  goalTitle: {
    type: String,
    default: 'JEE Mains & Advanced'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    index: true
  },
  topic: {
    type: String,
    default: '',
    index: true
  },
  stageNumber: {
    type: Number,
    default: 1
  },
  contentType: {
    type: String,
    enum: ['pdf', 'notes', 'video', 'document', 'assignment', 'practice', 'link'],
    default: 'pdf',
    index: true
  },
  mediaUrl: {
    type: String,
    required: [true, 'Media, video, or document link URL is required'],
    trim: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
    index: true
  },
  fileSize: {
    type: String,
    default: ''
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

teacherContentSchema.index({ goalSlug: 1, subject: 1, visibility: 1 });

export default mongoose.model('TeacherContent', teacherContentSchema);
