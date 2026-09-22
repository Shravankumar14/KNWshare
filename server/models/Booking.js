import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertProfile',
    required: false,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvailabilitySlot',
    required: false,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: false,
  },
  goalSlug: {
    type: String,
    default: 'jee-mains-advanced',
  },
  subject: {
    type: String,
    default: 'General Guidance',
  },
  sessionDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  dayOfWeek: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String, // e.g. "10:00 AM - 10:45 AM"
    default: '',
  },
  startTime: {
    type: String,
    default: '10:00 AM',
  },
  endTime: {
    type: String,
    default: '10:45 AM',
  },
  durationMinutes: {
    type: Number,
    default: 45,
  },
  studentQuestion: {
    type: String,
    default: '',
  },
  studentNotes: {
    type: String,
    default: '',
  },
  teacherNotes: {
    type: String,
    default: '',
  },
  meetingUrl: {
    type: String,
    default: 'https://meet.jit.si/infonest-guidance-session',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'confirmed',
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
