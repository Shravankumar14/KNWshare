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
    // CHANGED: only required for normal email/password accounts
    required: [function () { return this.authProvider === 'local'; }, 'Password is required'],
    minlength: 6,
    select: false,
  },
  // NEW: how this account was created
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  // NEW: Google's permanent user ID (the "sub" field in the token)
  googleId: {
    type: String,
    unique: true,
    sparse: true, // lets many users have NO googleId without clashing
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
  currentGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    default: null,
  },
  currentGoalSlug: {
    type: String,
    default: 'jee-main-advanced',
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
  // CHANGED: Google users have no password, so bcrypt would crash without this guard
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);