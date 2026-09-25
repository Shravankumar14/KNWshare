import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import { generateToken } from '../utils/jwt.js';
import { OAuth2Client } from 'google-auth-library';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, subjects, qualification, experienceYears, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = (role === 'teacher') ? 'teacher' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      bio: bio || '',
    });

    // If teacher, initialize teacher profile
    if (assignedRole === 'teacher') {
      await TeacherProfile.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        headline: qualification ? `${qualification} · Academic Mentor` : 'Academic Coach & Mentor',
        bio: bio || 'Passionate educator providing personalized 1-on-1 concept coaching and doubt clearance.',
        subjects: subjects && subjects.length > 0 ? subjects : ['Physics'],
        expertise: ['JEE Main', 'JEE Advanced'],
        qualification: qualification || 'M.Tech / M.Sc from Premier Institute',
        experienceYears: Number(experienceYears) || 5,
        goalsSupported: ['jee-mains-advanced', 'full-stack-development']
      });

      // Initialize default availability slots for the teacher
      const sampleSlots = [
        { dayOfWeek: 'Monday', startTime: '10:00 AM', endTime: '10:45 AM', durationMinutes: 45 },
        { dayOfWeek: 'Wednesday', startTime: '04:00 PM', endTime: '04:45 PM', durationMinutes: 45 },
        { dayOfWeek: 'Friday', startTime: '06:00 PM', endTime: '06:45 PM', durationMinutes: 45 }
      ];

      for (const s of sampleSlots) {
        await AvailabilitySlot.create({
          teacherId: user._id,
          ...s,
          isRecurring: true,
          isBooked: false,
          isActive: true
        }).catch(e => console.warn('Init slot warn:', e.message));
      }
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeGoal: user.activeGoal,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('activeGoal');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeGoal: user.activeGoal,
      },
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeGoal: user.activeGoal,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(googleClientId);

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('Google token verification failed:', verifyErr.message);
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const { email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account has no email' });
    }

    let user = await User.findOne({ email }).populate('activeGoal');
    if (!user) {
      user = await User.create({
        name: name || 'Student',
        email,
        password: Math.random().toString(36).slice(-12) + 'Ab1!',
        role: 'student',
        avatar: picture || '',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeGoal: user.activeGoal,
      },
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeGoal: user.activeGoal,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'activeGoal',
      populate: { path: 'goalId' }
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
