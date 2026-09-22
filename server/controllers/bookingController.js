import Booking from '../models/Booking.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createBooking = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { slotId, teacherId, goalId, goalSlug, subject, studentQuestion, studentNotes } = req.body;

    if (!slotId) {
      return res.status(400).json({ success: false, message: 'Availability slotId is required to book a session.' });
    }

    // 1. Atomic slot reservation (Prevents double booking race conditions)
    const reservedSlot = await AvailabilitySlot.findOneAndUpdate(
      { _id: slotId, isBooked: false, isActive: true },
      { $set: { isBooked: true, bookedBy: studentId } },
      { new: true }
    );

    if (!reservedSlot) {
      return res.status(400).json({
        success: false,
        message: 'This slot is no longer available or was already booked by another student.'
      });
    }

    // Determine session date
    const now = new Date();
    let sessionDate = reservedSlot.specificDate;
    if (!sessionDate) {
      // For recurring slots, calculate the upcoming date for that dayOfWeek
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIndex = days.indexOf(reservedSlot.dayOfWeek);
      const currentDayIndex = now.getDay();
      let daysAhead = targetDayIndex - currentDayIndex;
      if (daysAhead <= 0) daysAhead += 7; // next occurrence

      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysAhead);
      sessionDate = targetDate.toISOString().split('T')[0];
    }

    // 2. Check for overlapping booking for this student on the same date and time
    const studentExistingBooking = await Booking.findOne({
      studentId,
      sessionDate,
      timeSlot: `${reservedSlot.startTime} - ${reservedSlot.endTime}`,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (studentExistingBooking) {
      // Revert slot booking
      await AvailabilitySlot.findByIdAndUpdate(slotId, {
        isBooked: false,
        bookedBy: null
      });
      return res.status(400).json({
        success: false,
        message: 'You already have another confirmed mentoring session booked at this exact time.'
      });
    }

    const meetingRoomId = `infonest-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const meetingUrl = `https://meet.jit.si/${meetingRoomId}`;

    // 3. Create Booking
    const booking = await Booking.create({
      studentId,
      teacherId: reservedSlot.teacherId || teacherId,
      slotId: reservedSlot._id,
      goalId: goalId || null,
      goalSlug: goalSlug || 'jee-mains-advanced',
      subject: subject || 'General Guidance',
      sessionDate,
      dayOfWeek: reservedSlot.dayOfWeek,
      timeSlot: `${reservedSlot.startTime} - ${reservedSlot.endTime}`,
      startTime: reservedSlot.startTime,
      endTime: reservedSlot.endTime,
      durationMinutes: reservedSlot.durationMinutes || 45,
      studentQuestion: studentQuestion || '',
      studentNotes: studentNotes || '',
      meetingUrl,
      status: 'confirmed'
    });

    // Link booking to slot
    await AvailabilitySlot.findByIdAndUpdate(slotId, { bookingId: booking._id });

    // 4. Create in-app Notifications for Student and Teacher
    await Notification.create({
      userId: studentId,
      type: 'booking_confirmed',
      title: '1-on-1 Guidance Session Confirmed! 🎓',
      message: `Your session is scheduled for ${reservedSlot.dayOfWeek}, ${sessionDate} at ${reservedSlot.startTime}. Room: ${meetingUrl}`,
      data: { bookingId: booking._id }
    }).catch(e => console.warn('Student notif error:', e.message));

    if (reservedSlot.teacherId) {
      await Notification.create({
        userId: reservedSlot.teacherId,
        type: 'booking_confirmed',
        title: 'New Student Booking Received! 📅',
        message: `${req.user.name} booked your ${reservedSlot.dayOfWeek} (${reservedSlot.startTime} - ${reservedSlot.endTime}) slot.`,
        data: { bookingId: booking._id }
      }).catch(e => console.warn('Teacher notif error:', e.message));
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Session successfully booked! Check your upcoming schedule or meeting room.'
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentBookings = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const bookings = await Booking.find({ studentId })
      .populate('teacherId', 'name email avatar')
      .populate('slotId')
      .sort({ sessionDate: 1, startTime: 1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const cancelStudentBooking = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, studentId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Free up availability slot
    if (booking.slotId) {
      await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
        isBooked: false,
        bookedBy: null,
        bookingId: null
      });
    }

    // Notify teacher
    if (booking.teacherId) {
      await Notification.create({
        userId: booking.teacherId,
        type: 'booking_confirmed',
        title: 'Session Cancelled by Student',
        message: `Mentoring session on ${booking.sessionDate} at ${booking.startTime} was cancelled and the slot is now open again.`
      }).catch(e => console.warn('Teacher cancel notif error:', e.message));
    }

    res.json({ success: true, message: 'Booking successfully cancelled and slot freed.' });
  } catch (err) {
    next(err);
  }
};
