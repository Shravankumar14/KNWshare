import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertProfile',
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
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
    type: String, // "05:00 PM - 05:45 PM"
    required: true,
  },
  studentQuestion: {
    type: String,
    default: '',
  },
  meetingLink: {
    type: String,
    default: 'https://meet.jit.si/knwshare-guidance-session',
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed',
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
