import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    default: '',
    trim: true,
  },
  date: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  credentialUrl: {
    type: String,
    default: '',
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

export default mongoose.model('Achievement', achievementSchema);
