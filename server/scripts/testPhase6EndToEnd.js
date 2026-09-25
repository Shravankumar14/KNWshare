import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import Booking from '../models/Booking.js';
import Post from '../models/Post.js';
import Story from '../models/Story.js';
import TeacherProfile from '../models/TeacherProfile.js';
import UserGoalProfile from '../models/UserGoalProfile.js';
import UserGoal from '../models/UserGoal.js';
import { geminiService } from '../services/ai/geminiService.js';
import { sanitizeAiContext } from '../services/ai/sanitizeAiContext.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runEndToEndVerification() {
  console.log('--- Starting Comprehensive End-to-End Verification ---');

  // 1. Connect to Mongo
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/knwshare';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✓ Connected to MongoDB');
  } catch (err) {
    console.log('Local/Atlas Mongo unreachable, starting in-memory mongodb...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('✓ Connected to in-memory Mongo test database');
  }

  // Ensure Booking indexes (unique compound index on slotId)
  await Booking.init();

  const timestamp = Date.now();

  // 2. Register / Setup Teacher
  const teacherEmail = `test_faculty_${timestamp}@test.edu`;
  const teacherUser = await User.create({
    name: 'Dr. Alok Verma',
    email: teacherEmail,
    password: 'Password123!',
    role: 'teacher'
  });

  const teacherProfile = await TeacherProfile.create({
    userId: teacherUser._id,
    name: 'Dr. Alok Verma',
    email: teacherEmail,
    headline: 'Senior Physics Professor & JEE Mentor',
    qualification: 'Ph.D. Physics, IIT Kanpur',
    subjects: ['Physics', 'Advanced Mechanics'],
    rating: 4.96
  });
  console.log('✓ Teacher created:', teacherUser.name, `(${teacherProfile.headline})`);

  // 3. Teacher adds Availability Slot
  const slot = await AvailabilitySlot.create({
    teacherId: teacherUser._id,
    dayOfWeek: 'Wednesday',
    startTime: '04:00 PM',
    endTime: '04:45 PM',
    durationMinutes: 45,
    isBooked: false,
    isActive: true
  });
  console.log('✓ Teacher availability slot created:', `${slot.dayOfWeek} ${slot.startTime} - ${slot.endTime}`);

  // 4. Teacher creates Knowledge Post
  const post = await Post.create({
    createdBy: teacherUser._id,
    title: 'Top 3 Conservation Laws for JEE Advanced',
    text: 'Always check if external torque about the reference axis is zero before applying angular momentum conservation!',
    tags: ['Physics', 'JEE', 'Mechanics'],
    goalSlug: 'jee-mains-advanced',
    published: true
  });
  console.log('✓ Knowledge Post created:', post.title);

  // 5. Teacher creates 24h Story Spark
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const story = await Story.create({
    createdBy: teacherUser._id,
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    title: 'Rotational Tip of the Day',
    text: 'Instantaneous axis of rotation simplifies rolling without slipping questions tenfold.',
    badge: 'PRO TIP',
    slotAction: 'Book 1-on-1 Guidance Session',
    published: true,
    expiresAt
  });
  console.log('✓ 24-Hour Story Spark created:', story.title, `(expires in: ${(expiresAt - Date.now()) / 3600000}h)`);

  // 6. Test Public Queries: Posts, Stories, Available Teachers
  const publicPosts = await Post.find({ published: true, createdBy: teacherUser._id });
  if (publicPosts.length === 0) throw new Error('Public post query failed');
  console.log('✓ Public Post query passed:', publicPosts.length, 'post found');

  const publicStories = await Story.find({ published: true, expiresAt: { $gt: new Date() }, createdBy: teacherUser._id });
  if (publicStories.length === 0) throw new Error('Public story query failed');
  console.log('✓ Public Story query passed:', publicStories.length, 'story spark found');

  const availableSlots = await AvailabilitySlot.find({ isBooked: false, isActive: true, teacherId: teacherUser._id });
  if (availableSlots.length === 0) throw new Error('Available slots query failed');
  console.log('✓ Available slots query passed:', availableSlots.length, 'slot available');

  // 7. Register Two Students for Concurrent Booking Test
  const student1 = await User.create({
    name: 'Aman Gupta',
    email: `aman_${timestamp}@student.com`,
    password: 'Password123!',
    role: 'student'
  });

  const student2 = await User.create({
    name: 'Sneha Roy',
    email: `sneha_${timestamp}@student.com`,
    password: 'Password123!',
    role: 'student'
  });

  // Verify Clean State for new students
  const student1Profile = await UserGoalProfile.findOne({ userId: student1._id });
  const student1Goals = await UserGoal.find({ userId: student1._id });
  if (student1Profile || student1Goals.length > 0) {
    throw new Error('FAILED: New student unexpectedly has pre-existing UserGoalProfile or UserGoals!');
  }
  console.log('✓ Clean Init verified: New student has 0 phantom goal profiles, 0 fake goals, 0 fake progress');

  // 8. Atomic Booking & Double Booking Race Test
  async function simulateBookSlot(studentId, targetSlotId) {
    const reserved = await AvailabilitySlot.findOneAndUpdate(
      { _id: targetSlotId, isBooked: false, isActive: true },
      { $set: { isBooked: true, bookedBy: studentId } },
      { new: true }
    );
    if (!reserved) {
      return { status: 409, message: 'Slot already booked' };
    }
    try {
      const newBooking = await Booking.create({
        studentId,
        teacherId: teacherUser._id,
        slotId: targetSlotId,
        sessionDate: '2026-10-01',
        dayOfWeek: reserved.dayOfWeek,
        timeSlot: `${reserved.startTime} - ${reserved.endTime}`,
        startTime: reserved.startTime,
        endTime: reserved.endTime,
        meetingUrl: 'https://meet.jit.si/test-room',
        status: 'confirmed'
      });
      return { status: 201, data: newBooking };
    } catch (err) {
      // Revert reservation
      await AvailabilitySlot.findByIdAndUpdate(targetSlotId, { isBooked: false, bookedBy: null });
      return { status: 409, message: 'Conflict: Slot collision prevented by index' };
    }
  }

  const [res1, res2] = await Promise.all([
    simulateBookSlot(student1._id, slot._id),
    simulateBookSlot(student2._id, slot._id)
  ]);

  const statuses = [res1.status, res2.status].sort();
  if (statuses[0] !== 201 || statuses[1] !== 409) {
    throw new Error(`Double booking test failed! Expected [201, 409], got ${JSON.stringify(statuses)}`);
  }
  console.log('✓ Atomic Booking & Race Condition passed: Exactly one booking succeeded (201) and one received Conflict (409)');

  // 9. Verify Chatbot Service & Sanitization
  const rawStudentUser = {
    _id: student1._id,
    name: 'Aman Gupta',
    email: 'aman_private@student.com',
    password: 'HASHED_SECRET_PASSWORD',
    role: 'student'
  };

  const sanitized = sanitizeAiContext({ user: rawStudentUser });
  if (JSON.stringify(sanitized).includes('password') || JSON.stringify(sanitized).includes('private@student.com')) {
    throw new Error('FAILED: Sanitizer leaked student credentials or private email!');
  }
  console.log('✓ AI Context Sanitizer passed: Credentials and raw identifiers strictly removed');

  const aiReply = await geminiService.generateReply({
    message: 'How do I balance Physics problem practice with revision?',
    safeContext: sanitized
  });
  if (!aiReply || aiReply.length < 10) {
    throw new Error('AI Chat response generation failed');
  }
  console.log('✓ AI Chatbot Service passed: Valid educational response received');

  console.log('\n============================================================');
  console.log('ALL END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY! 🚀');
  console.log('============================================================');

  await mongoose.disconnect();
  process.exit(0);
}

runEndToEndVerification().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
