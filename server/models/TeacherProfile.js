import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop'
  },
  headline: {
    type: String,
    default: 'Experienced Academic Mentor & Educator'
  },
  bio: {
    type: String,
    default: 'Dedicated to helping ambitious students master complex concepts, develop problem-solving rigor, and excel in competitive exams.'
  },
  subjects: [{
    type: String,
    enum: ['Physics', 'Chemistry', 'Mathematics', 'Full Stack Development', 'AI & Machine Learning', 'Data Structures & Algorithms']
  }],
  expertise: [{
    type: String
  }],
  experienceYears: {
    type: Number,
    default: 5
  },
  qualification: {
    type: String,
    default: 'B.Tech / M.Sc from Premier Institute'
  },
  teachingAreas: [{
    type: String
  }],
  goalsSupported: [{
    type: String,
    default: ['jee-mains-advanced']
  }],
  preferredLanguage: {
    type: String,
    default: 'English & Hindi'
  },
  sessionDurationsAvailable: [{
    type: Number,
    enum: [30, 45, 60],
    default: [30, 45, 60]
  }],
  rating: {
    type: Number,
    default: 4.95,
    min: 1,
    max: 5
  },
  studentsHelped: {
    type: Number,
    default: 0
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    website: { type: String, default: '' }
  }
}, {
  timestamps: true
});

export default mongoose.model('TeacherProfile', teacherProfileSchema);
