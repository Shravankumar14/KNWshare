import mongoose from 'mongoose';

const workExperienceSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  teacherProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherProfile',
    index: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  employmentType: {
    type: String,
    default: 'Full-time',
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  skills: [{
    type: String,
  }],
  achievements: [{
    type: String,
  }]
}, {
  timestamps: true,
});

export default mongoose.model('WorkExperience', workExperienceSchema);
