import TeacherProfile from '../models/TeacherProfile.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import TeacherContent from '../models/TeacherContent.js';

// Helper to convert time string e.g. "09:30 AM", "10:45AM", or "14:30" to minutes from midnight
const timeStringToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10) || 0;
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
};

// ==========================================
// 1. TEACHER PROFILE MANAGEMENT
// ==========================================

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
        goalsSupported: ['jee-mains-advanced'],
        currentPosition: {
          company: 'Senior Faculty',
          jobTitle: 'JEE Physics Coach',
          startDate: '2021'
        },
        languages: ['English', 'Hindi']
      });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

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

// ==========================================
// 2. AVAILABILITY SLOTS (Add, Edit, Delete, Query)
// ==========================================

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

    // Overlap check
    const existingSlots = await AvailabilitySlot.find({
      teacherId: userId,
      dayOfWeek,
      isActive: true,
      ...(specificDate ? { specificDate } : {})
    });

    for (const slot of existingSlots) {
      const existStart = timeStringToMinutes(slot.startTime);
      const existEnd = timeStringToMinutes(slot.endTime);

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

export const updateAvailabilitySlot = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, durationMinutes, isRecurring } = req.body;

    const slot = await AvailabilitySlot.findOne({ _id: id, teacherId: userId });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ success: false, message: 'Cannot edit a slot that has already been booked by a student.' });
    }

    const targetDay = dayOfWeek || slot.dayOfWeek;
    const targetStart = startTime || slot.startTime;
    const targetEnd = endTime || slot.endTime;

    const newStart = timeStringToMinutes(targetStart);
    const newEnd = timeStringToMinutes(targetEnd);

    if (newEnd <= newStart) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    // Overlap check excluding this slot
    const existingSlots = await AvailabilitySlot.find({
      _id: { $ne: id },
      teacherId: userId,
      dayOfWeek: targetDay,
      isActive: true
    });

    for (const other of existingSlots) {
      const existStart = timeStringToMinutes(other.startTime);
      const existEnd = timeStringToMinutes(other.endTime);

      if (Math.max(newStart, existStart) < Math.min(newEnd, existEnd)) {
        return res.status(400).json({
          success: false,
          message: `Updated time overlaps with slot: ${other.dayOfWeek} ${other.startTime} - ${other.endTime}`
        });
      }
    }

    if (dayOfWeek) slot.dayOfWeek = dayOfWeek;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (durationMinutes) slot.durationMinutes = Number(durationMinutes);
    if (isRecurring !== undefined) slot.isRecurring = isRecurring;

    await slot.save();

    res.json({ success: true, data: slot, message: 'Availability slot updated successfully!' });
  } catch (err) {
    next(err);
  }
};

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

// ==========================================
// 3. STUDENT SESSIONS & BOOKING MANAGEMENT
// ==========================================

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

// ==========================================
// 4. TEACHER CONTENT (Notes, PDFs, Videos, Material)
// ==========================================

export const getMyTeacherContent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contents = await TeacherContent.find({ teacherId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: contents.length, data: contents });
  } catch (err) {
    next(err);
  }
};

export const createTeacherContent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await TeacherProfile.findOne({ userId });

    const {
      title,
      description,
      goalSlug,
      goalTitle,
      subject,
      topic,
      stageNumber,
      contentType,
      mediaUrl,
      thumbnailUrl,
      visibility,
      fileSize
    } = req.body;

    if (!title || !subject || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and media/link URL are required.'
      });
    }

    const content = await TeacherContent.create({
      teacherId: userId,
      teacherProfileId: profile?._id || null,
      title: title.trim(),
      description: description || '',
      goalSlug: goalSlug || 'jee-mains-advanced',
      goalTitle: goalTitle || 'JEE Mains & Advanced',
      subject: subject.trim(),
      topic: topic ? topic.trim() : 'General',
      stageNumber: Number(stageNumber) || 1,
      contentType: contentType || 'pdf',
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl || '',
      visibility: visibility || 'published',
      fileSize: fileSize || ''
    });

    res.status(201).json({
      success: true,
      data: content,
      message: 'Educational material published successfully!'
    });
  } catch (err) {
    next(err);
  }
};

export const updateTeacherContent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const content = await TeacherContent.findOneAndUpdate(
      { _id: id, teacherId: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    res.json({ success: true, data: content, message: 'Content updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteTeacherContent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await TeacherContent.findOneAndDelete({ _id: id, teacherId: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    res.json({ success: true, message: 'Content removed successfully' });
  } catch (err) {
    next(err);
  }
};

// Public: Students discover published materials filtered by goal & subject
export const getPublicTeacherContent = async (req, res, next) => {
  try {
    const { goalSlug, subject, topic, contentType } = req.query;
    const query = { visibility: 'published' };

    if (goalSlug) query.goalSlug = goalSlug;
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (topic) query.topic = { $regex: topic, $options: 'i' };
    if (contentType && contentType !== 'all') query.contentType = contentType;

    const materials = await TeacherContent.find(query)
      .populate('teacherId', 'name avatar')
      .populate('teacherProfileId', 'headline photo rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 5. ACHIEVEMENTS & RECOGNITION
// ==========================================

export const addAchievement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, organization, date, description, credentialUrl, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Achievement title is required' });
    }

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    profile.achievements.unshift({
      title,
      organization: organization || '',
      date: date || '',
      description: description || '',
      credentialUrl: credentialUrl || '',
      imageUrl: imageUrl || ''
    });

    await profile.save();
    res.status(201).json({ success: true, data: profile.achievements, message: 'Achievement added successfully!' });
  } catch (err) {
    next(err);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const item = profile.achievements.id(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    Object.assign(item, updates);
    await profile.save();

    res.json({ success: true, data: profile.achievements, message: 'Achievement updated!' });
  } catch (err) {
    next(err);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    profile.achievements.pull(id);
    await profile.save();

    res.json({ success: true, data: profile.achievements, message: 'Achievement removed!' });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 6. PROFESSIONAL WORK EXPERIENCE
// ==========================================

export const addWorkExperience = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { company, jobTitle, employmentType, startDate, endDate, current, description, skills, achievements } = req.body;

    if (!company || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Company and Job Title are required' });
    }

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    profile.workExperiences.unshift({
      company,
      jobTitle,
      employmentType: employmentType || 'Full-time',
      startDate: startDate || '',
      endDate: current ? 'Present' : (endDate || ''),
      current: !!current,
      description: description || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      achievements: Array.isArray(achievements) ? achievements : (achievements ? achievements.split(',').map(s => s.trim()) : [])
    });

    await profile.save();
    res.status(201).json({ success: true, data: profile.workExperiences, message: 'Work experience added!' });
  } catch (err) {
    next(err);
  }
};

export const updateWorkExperience = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const item = profile.workExperiences.id(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Work experience entry not found' });
    }

    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim());
    }
    if (updates.achievements && typeof updates.achievements === 'string') {
      updates.achievements = updates.achievements.split(',').map(s => s.trim());
    }

    Object.assign(item, updates);
    await profile.save();

    res.json({ success: true, data: profile.workExperiences, message: 'Work experience updated!' });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkExperience = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const profile = await TeacherProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    profile.workExperiences.pull(id);
    await profile.save();

    res.json({ success: true, data: profile.workExperiences, message: 'Work experience removed!' });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 7. PUBLIC TEACHER DISCOVERY
// ==========================================

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

export const getTeacherPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    let profile = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      profile = await TeacherProfile.findOne({
        $or: [{ _id: id }, { userId: id }]
      });
    }
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const availableSlots = await AvailabilitySlot.find({
      teacherId: profile.userId,
      isBooked: false,
      isActive: true
    }).sort({ dayOfWeek: 1, startTime: 1 });

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        availableSlots
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAvailableTeachers = async (req, res, next) => {
  try {
    const availableSlots = await AvailabilitySlot.find({
      isBooked: false,
      isActive: true
    }).populate('teacherId', 'name email avatar role bio').sort({ dayOfWeek: 1, startTime: 1 });

    const teacherMap = new Map();

    for (const slot of availableSlots) {
      if (!slot.teacherId) continue;
      const tId = slot.teacherId._id.toString();

      if (!teacherMap.has(tId)) {
        teacherMap.set(tId, {
          user: slot.teacherId,
          slots: []
        });
      }
      teacherMap.get(tId).slots.push(slot);
    }

    const results = [];
    for (const [tId, { user, slots }] of teacherMap.entries()) {
      const profile = await TeacherProfile.findOne({ userId: tId });
      results.push({
        _id: tId,
        teacherId: tId,
        name: profile?.name || user.name,
        email: profile?.email || user.email,
        avatar: profile?.photo || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2d0000&color=ff4444`,
        headline: profile?.headline || profile?.currentPosition?.jobTitle || 'Academic Coach & Mentor',
        bio: profile?.bio || user.bio || '',
        subjects: profile?.subjects || [],
        ...(profile?.rating ? { rating: profile.rating } : {}),
        nextAvailableSlot: slots[0] ? `${slots[0].dayOfWeek} ${slots[0].startTime}` : null,
        slotsCount: slots.length,
        availableSlots: slots
      });
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

