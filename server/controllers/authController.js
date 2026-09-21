import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

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
        bio: 'Passionate computer science student aiming for full-stack mastery and cloud scalability.',
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
