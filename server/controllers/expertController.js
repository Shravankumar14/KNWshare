import ExpertProfile from '../models/ExpertProfile.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

export const getAllExperts = async (req, res, next) => {
  try {
    let resolvedGoalId = goalId;
    if (goalId && !mongoose.Types.ObjectId.isValid(goalId)) {
      const g = await Goal.findOne({ slug: goalId });
      if (g) resolvedGoalId = g._id;
    }

    const query = { isAvailable: true };
    if (resolvedGoalId) {
      query.$or = [{ targetGoals: resolvedGoalId }, { targetGoals: { $size: 0 } }];
    }
    if (expertise) {
      query.expertiseAreas = new RegExp(expertise, 'i');
    }

    const experts = await ExpertProfile.find(query).sort({ rating: -1, yearsOfExperience: -1 });

    res.json({
      success: true,
      count: experts.length,
      data: experts
    });
  } catch (err) {
    next(err);
  }
};

export const getExpertById = async (req, res, next) => {
  try {
    const expert = await ExpertProfile.findById(req.params.id).populate('targetGoals');
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert profile not found' });
    }
    res.json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};

export const bookSlot = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { expertId, goalId, sessionDate, dayOfWeek, timeSlot, studentQuestion } = req.body;

    const expert = await ExpertProfile.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Generate unique video conferencing link (using Jitsi Meet room for instant browser video)
    const roomCode = `knwshare-${expert.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;
    const meetingLink = `https://meet.jit.si/${roomCode}`;

    const booking = await Booking.create({
      studentId,
      expertId,
      goalId: goalId || req.user.activeGoal,
      sessionDate,
      dayOfWeek,
      timeSlot,
      studentQuestion: studentQuestion || '',
      meetingLink,
      status: 'confirmed'
    });

    // Notify student
    await Notification.create({
      userId: studentId,
      title: 'Expert Session Confirmed!',
      message: `Your 1-on-1 mentorship session with ${expert.name} is confirmed for ${sessionDate} at ${timeSlot}.`,
      type: 'booking_confirmed',
      link: '/roadmap'
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: `Guidance session successfully booked with ${expert.name}!`
    });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate('expertId')
      .populate('goalId')
      .sort({ sessionDate: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};
