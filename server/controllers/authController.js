import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import { generateToken } from '../utils/jwt.js';

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
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
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

export const demoLogin = async (req, res, next) => {
  try {
    let demoUser = await User.findOne({ email: 'student@knwshare.dev' }).select('+password');
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Rivera',
        email: 'student@knwshare.dev',
        password: 'password123',
        role: 'student',
        bio: 'Passionate student aiming for competitive exam excellence and structured study routines.',
      });
    }

    const token = generateToken(demoUser._id, demoUser.role);

    res.json({
      success: true,
      data: {
        _id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        activeGoal: demoUser.activeGoal,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const demoTeacherLogin = async (req, res, next) => {
  try {
    let teacherUser = await User.findOne({ email: 'teacher@knwshare.dev' }).select('+password');
    if (!teacherUser) {
      teacherUser = await User.create({
        name: 'Dr. Arvind Kumar',
        email: 'teacher@knwshare.dev',
        password: 'password123',
        role: 'teacher',
        avatar: 'https://i.pravatar.cc/150?img=68',
        bio: 'Ex-FIITJEE Sr. Faculty with 14+ years mentoring students into top 100 All India Ranks in IIT-JEE.',
      });
    } else if (teacherUser.role !== 'teacher') {
      teacherUser.role = 'teacher';
      await teacherUser.save();
    }

    // Ensure teacher profile exists
    let profile = await TeacherProfile.findOne({ userId: teacherUser._id });
    if (!profile) {
      profile = await TeacherProfile.create({
        userId: teacherUser._id,
        name: 'Dr. Arvind Kumar',
        email: teacherUser.email,
        photo: 'https://i.pravatar.cc/150?img=68',
        headline: 'Ph.D. Physical Chemistry IIT Kanpur | Ex-FIITJEE Sr. Faculty',
        bio: 'Guided over 2,400 students into IITs with 12 students in the All India Top 50. Expert in Physical & Inorganic Chemistry and time-tested numerical shortcuts.',
        subjects: ['Chemistry', 'Physics'],
        expertise: ['JEE Main', 'JEE Advanced'],
        qualification: 'Ph.D. IIT Kanpur | B.Sc Gold Medalist',
        experienceYears: 14,
        teachingAreas: ['Physical Chemistry', 'Thermodynamics & Equilibrium', 'Electrochemistry', 'Organic Reaction Mechanisms'],
        goalsSupported: ['jee-mains-advanced'],
        preferredLanguage: 'English & Hindi',
        rating: 4.98,
        studentsHelped: 2420
      });
    }

    // Ensure demo slots exist
    const slotCount = await AvailabilitySlot.countDocuments({ teacherId: teacherUser._id, isActive: true });
    if (slotCount === 0) {
      const demoSlots = [
        { dayOfWeek: 'Monday', startTime: '10:00 AM', endTime: '10:45 AM', durationMinutes: 45 },
        { dayOfWeek: 'Monday', startTime: '03:00 PM', endTime: '03:45 PM', durationMinutes: 45 },
        { dayOfWeek: 'Tuesday', startTime: '11:00 AM', endTime: '11:45 AM', durationMinutes: 45 },
        { dayOfWeek: 'Wednesday', startTime: '05:00 PM', endTime: '05:45 PM', durationMinutes: 45 },
        { dayOfWeek: 'Thursday', startTime: '02:00 PM', endTime: '02:45 PM', durationMinutes: 45 },
        { dayOfWeek: 'Friday', startTime: '06:00 PM', endTime: '06:45 PM', durationMinutes: 45 },
        { dayOfWeek: 'Saturday', startTime: '10:00 AM', endTime: '10:45 AM', durationMinutes: 45 }
      ];

      for (const s of demoSlots) {
        await AvailabilitySlot.create({
          teacherId: teacherUser._id,
          ...s,
          isRecurring: true,
          isBooked: false,
          isActive: true
        });
      }
    }

    const token = generateToken(teacherUser._id, teacherUser.role);

    res.json({
      success: true,
      data: {
        _id: teacherUser._id,
        name: teacherUser.name,
        email: teacherUser.email,
        role: teacherUser.role,
        activeGoal: teacherUser.activeGoal,
        token,
      },
      message: 'Logged in as Demo Teacher (Dr. Arvind Kumar)!'
    });
  } catch (err) {
    next(err);
  }
};
