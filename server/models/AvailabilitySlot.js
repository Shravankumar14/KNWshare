import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  specificDate: {
    type: String, // YYYY-MM-DD for one-time slots, null/empty for recurring weekly
    default: ''
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: String, // e.g. "10:00 AM"
    required: true
  },
  endTime: {
    type: String, // e.g. "10:45 AM"
    required: true
  },
  durationMinutes: {
    type: Number,
    enum: [30, 45, 60],
    default: 45
  },
  isBooked: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, {
  timestamps: true
});

// Index to quickly find active, unbooked slots for a teacher
availabilitySlotSchema.index({ teacherId: 1, isBooked: 1, isActive: 1 });

export default mongoose.model('AvailabilitySlot', availabilitySlotSchema);
