import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'expert', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  activeGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGoal',
    default: null,
  },
  preferences: {
    defaultHoursPerDay: { type: Number, default: 2 },
    preferredStudyTime: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'], default: 'morning' },
    emailNotifications: { type: Boolean, default: true },
    inAppReminders: { type: Boolean, default: true },
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
