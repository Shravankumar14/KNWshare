import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Today', 'Tomorrow'],
    required: true,
  },
  startTime: { type: String, required: true }, // "05:00 PM"
  endTime: { type: String, required: true },   // "06:00 PM"
  isBooked: { type: Boolean, default: false }
});

const expertProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  companyOrCollege: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    required: true,
  },
  expertiseAreas: [{
    type: String,
  }],
  targetGoals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  }],
  yearsOfExperience: {
    type: Number,
    default: 3,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.9,
  },
  sessionsCompleted: {
    type: Number,
    default: 48,
  },
  sessionDurationMinutes: {
    type: Number,
    default: 45,
  },
  topicsCanHelpWith: [{
    type: String,
  }],
  availableSlots: [availabilitySlotSchema],
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('ExpertProfile', expertProfileSchema);
