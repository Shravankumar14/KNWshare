import TeacherProfile from '../models/TeacherProfile.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Helper to convert time string e.g. "09:30 AM" to minutes from midnight
const timeStringToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(/[:\s]/);
  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10) || 0;
  const ampm = parts[2]?.toUpperCase();

  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
};

// 1. Get Logged-in Teacher's Profile
export const getMyTeacherProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await TeacherProfile.findOne({ userId });

    if (!profile) {
      profile = await TeacherProfile.create({
        userId,
        name: req.user.name,
        email: req.user.email,
        photo: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop',
        subjects: ['Physics'],
        expertise: ['JEE Main', 'JEE Advanced'],
        goalsSupported: ['jee-mains-advanced']
      });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

// 2. Update Teacher Profile
export const updateMyTeacherProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    const profile = await TeacherProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    // Sync avatar & name to User document if updated
    if (updates.name || updates.photo) {
      await User.findByIdAndUpdate(userId, {
        ...(updates.name && { name: updates.name }),
        ...(updates.photo && { avatar: updates.photo })
      });
    }

    res.json({ success: true, data: profile, message: 'Teacher profile updated successfully!' });
  } catch (err) {
    next(err);
  }
};

// 3. Get Teacher's Availability Slots
export const getMyAvailabilitySlots = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const slots = await AvailabilitySlot.find({ teacherId: userId, isActive: true })
      .populate('bookedBy', 'name email avatar')
      .populate('bookingId')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    next(err);
  }
};

// 4. Add Availability Slot (with Overlap Prevention)
export const addAvailabilitySlot = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { dayOfWeek, specificDate, startTime, endTime, durationMinutes = 45, isRecurring = true } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Day of week, start time, and end time are required' });
    }

    const newStart = timeStringToMinutes(startTime);
    const newEnd = timeStringToMinutes(endTime);

    if (newEnd <= newStart) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    // Overlap check: Query existing active slots for this teacher on this day
    const existingSlots = await AvailabilitySlot.find({
      teacherId: userId,
      dayOfWeek,
      isActive: true,
      ...(specificDate ? { specificDate } : {})
    });

    for (const slot of existingSlots) {
      const existStart = timeStringToMinutes(slot.startTime);
      const existEnd = timeStringToMinutes(slot.endTime);

      // Overlap condition: max(start1, start2) < min(end1, end2)
      if (Math.max(newStart, existStart) < Math.min(newEnd, existEnd)) {
        return res.status(400).json({
          success: false,
          message: `Slot overlaps with existing slot: ${slot.dayOfWeek} ${slot.startTime} - ${slot.endTime}`
        });
      }
    }

    const createdSlot = await AvailabilitySlot.create({
      teacherId: userId,
      dayOfWeek,
      specificDate: specificDate || '',
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 45,
      isRecurring,
      isBooked: false,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: createdSlot,
      message: 'Availability slot created successfully!'
    });
  } catch (err) {
    next(err);
  }
};

// 5. Delete / Deactivate Availability Slot
export const deleteAvailabilitySlot = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const slot = await AvailabilitySlot.findOne({ _id: id, teacherId: userId });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Availability slot not found' });
    }

    // If already booked, notify student of cancellation
    if (slot.isBooked && slot.bookingId) {
      await Booking.findByIdAndUpdate(slot.bookingId, {
        status: 'cancelled',
        teacherNotes: 'Session cancelled by teacher due to schedule change.'
      });
    }

    await AvailabilitySlot.findByIdAndDelete(id);

    res.json({ success: true, message: 'Availability slot removed successfully' });
  } catch (err) {
    next(err);
  }
};

// 6. Get Teacher's Student Bookings
export const getTeacherBookings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ teacherId: userId })
      .populate('studentId', 'name email avatar')
      .populate('slotId')
      .sort({ sessionDate: 1, startTime: 1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// 7. Teacher Updates Booking Status / Meeting Link
export const updateBookingStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { status, meetingUrl, teacherNotes } = req.body;

    const booking = await Booking.findOne({ _id: id, teacherId: userId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (meetingUrl) booking.meetingUrl = meetingUrl;
    if (teacherNotes !== undefined) booking.teacherNotes = teacherNotes;

    await booking.save();

    // If cancelled or rejected, release the slot
    if (['cancelled', 'rejected'].includes(status) && booking.slotId) {
      await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
        isBooked: false,
        bookedBy: null,
        bookingId: null
      });
    }

    // Notify student
    await Notification.create({
      userId: booking.studentId,
      type: 'booking_confirmed',
      title: `Session ${status}: 1-on-1 Guidance`,
      message: `Your mentoring session on ${booking.sessionDate} at ${booking.startTime} is marked as ${status}.${meetingUrl ? ` Meeting link: ${meetingUrl}` : ''}`
    }).catch(e => console.warn('Notification err:', e.message));

    res.json({ success: true, data: booking, message: `Booking marked as ${status}!` });
  } catch (err) {
    next(err);
  }
};

// 8. Public: Discover Teachers (Filtered by Goal & Subject)
export const getPublicTeachers = async (req, res, next) => {
  try {
    const { goalSlug, subject, search } = req.query;

    let query = {};
    if (goalSlug) {
      query.goalsSupported = goalSlug;
    }
    if (subject && subject !== 'All Subjects') {
      query.subjects = subject;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { subjects: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await TeacherProfile.find(query).sort({ rating: -1, studentsHelped: -1 });

    // Attach count of available slots for each teacher
    const enriched = await Promise.all(
      teachers.map(async (t) => {
        const availableSlotsCount = await AvailabilitySlot.countDocuments({
          teacherId: t.userId,
          isBooked: false,
          isActive: true
        });
        const obj = t.toObject();
        return {
          ...obj,
          availableSlotsCount
        };
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

// 9. Public: Get Available Slots for a Specific Teacher
export const getTeacherPublicSlots = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    const slots = await AvailabilitySlot.find({
      teacherId,
      isBooked: false,
      isActive: true
    }).sort({ dayOfWeek: 1, startTime: 1 });

    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    next(err);
  }
};
