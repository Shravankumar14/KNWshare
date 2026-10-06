import crypto from 'crypto';
import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import { generateToken } from '../utils/jwt.js';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, subjects, qualification, experienceYears, bio } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      if (!userExists.isEmailVerified) {
        // Unverified user: resend a fresh verification email
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        userExists.emailVerificationToken = hashedToken;
        userExists.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        if (password) userExists.password = password;
        if (name) userExists.name = name;
        await userExists.save();

        // Ensure teacher profile exists if role is teacher
        if (userExists.role === 'teacher' || role === 'teacher') {
          let teacherProfile = await TeacherProfile.findOne({ userId: userExists._id });
          if (!teacherProfile) {
            await TeacherProfile.create({
              userId: userExists._id,
              name: userExists.name,
              email: userExists.email,
              headline: qualification ? `${qualification} · Academic Mentor` : 'Academic Coach & Mentor',
              bio: bio || 'Passionate educator providing personalized 1-on-1 concept coaching and doubt clearance.',
              subjects: subjects && subjects.length > 0 ? subjects : ['Physics'],
              expertise: ['JEE Main', 'JEE Advanced'],
              qualification: qualification || 'M.Tech / M.Sc from Premier Institute',
              experienceYears: Number(experienceYears) || 5,
              goalsSupported: ['jee-mains-advanced', 'full-stack-development'],
            }).catch((tpErr) => console.warn('TeacherProfile create warning on unverified re-register:', tpErr.message));
          }
        }

        try {
          await sendVerificationEmail(userExists.email, rawToken);
        } catch (emailErr) {
          console.error('Failed to send verification email:', emailErr.message);
          return res.status(503).json({
            success: false,
            message: 'Account updated, but verification email service is temporarily unavailable. Please try resending verification from the login page.',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Check your inbox to verify your email',
        });
      }

      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = (role === 'teacher') ? 'teacher' : 'student';

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: assignedRole,
      bio: bio || '',
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires,
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

    try {
      await sendVerificationEmail(user.email, rawToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message);
      return res.status(503).json({
        success: false,
        message: 'Account created, but verification email service is temporarily unavailable. Please try resending verification from the login page.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Check your inbox to verify your email',
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid or missing verification token' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage = 'If an account exists with this email, a verification link has been sent.';

    if (!email) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+emailVerificationToken +emailVerificationExpires');

    if (user && !user.isEmailVerified) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      try {
        await sendVerificationEmail(user.email, rawToken);
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr.message);
        return res.status(503).json({
          success: false,
          message: 'Unable to send verification email at this time. Please try again later.',
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
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

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password').populate('activeGoal');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email does not exist' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        needsVerification: true,
      });
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
    const incomingToken = req.body.credential || req.body.access_token || req.body.token;
    if (!incomingToken) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(googleClientId);

    let payload;

    // Determine whether token is an ID token (JWT with 3 parts: header.payload.signature)
    // or an OAuth2 access token (e.g. starts with "ya29." with 2 segments)
    const isIdToken = typeof incomingToken === 'string' && incomingToken.split('.').length === 3;

    if (isIdToken) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: incomingToken,
          audience: googleClientId,
        });
        payload = ticket.getPayload();
      } catch (verifyErr) {
        console.warn('Google ID token verification failed:', verifyErr.message);
        return res.status(401).json({ success: false, message: 'Invalid Google token' });
      }
    } else {
      try {
        // Validate the OAuth2 access token using Google's tokeninfo endpoint
        const tokenInfo = await client.getTokenInfo(incomingToken);

        // Security requirement: audience/client-ID validation
        if (googleClientId && tokenInfo.aud && tokenInfo.aud !== googleClientId) {
          console.warn(`Google token audience mismatch: expected ${googleClientId}, got ${tokenInfo.aud}`);
          return res.status(401).json({ success: false, message: 'Invalid Google token audience' });
        }

        // Fetch verified user profile from Google's UserInfo endpoint
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${incomingToken}`,
          },
        });

        if (!userInfoRes.ok) {
          console.warn('Failed to fetch userinfo from Google API:', userInfoRes.status, userInfoRes.statusText);
          return res.status(401).json({ success: false, message: 'Failed to retrieve Google user profile' });
        }

        const profile = await userInfoRes.json();

        payload = {
          email: profile.email || tokenInfo.email,
          name: profile.name,
          picture: profile.picture,
          sub: profile.sub || tokenInfo.sub,
          email_verified: profile.email_verified ?? (tokenInfo.email_verified === 'true' || tokenInfo.email_verified === true),
        };
      } catch (accessErr) {
        console.warn('Google access token verification failed:', accessErr.message);
        return res.status(401).json({ success: false, message: 'Invalid Google token' });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Google account has no email' });
    }

    if (!payload.email_verified) {
      return res.status(403).json({ success: false, message: 'Google email is not verified' });
    }

    const { email, name, picture } = payload;
    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select('+password').populate('activeGoal');

    if (!user) {
      user = await User.create({
        name: name || 'Student',
        email: normalizedEmail,
        googleId: payload.sub,
        authProvider: 'google',
        isEmailVerified: true,
        role: 'student',
        avatar: picture || '',
      });
    } else {
      user.googleId = payload.sub || user.googleId;
      const wasUnverified = !user.isEmailVerified;
      user.isEmailVerified = true;
      if (wasUnverified) {
        user.password = undefined;
        user.authProvider = 'google';
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save();
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
        isEmailVerified: true,
      });
    } else if (!demoUser.isEmailVerified) {
      demoUser.isEmailVerified = true;
      await demoUser.save();
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
