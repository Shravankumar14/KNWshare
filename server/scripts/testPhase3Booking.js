import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import AvailabilitySlot from '../models/AvailabilitySlot.js';
import Booking from '../models/Booking.js';
import TeacherProfile from '../models/TeacherProfile.js';
import { createBooking } from '../controllers/bookingController.js';

// Mock express req/res
function mockReqRes(body, user) {
  const req = { body, user };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    }
  };

  const next = (err) => {
    statusCode = 500;
    responseData = { error: err?.message || err };
  };

  return { req, res, getStatus: () => statusCode, getData: () => responseData, next };
}

async function testPhase3() {
  console.log('[Test Phase 3] Testing availability and atomic booking race condition...');
  try {
    await connectDB();

    // 1. Create a teacher and two students
    const teacher = await User.create({
      name: 'Prof. Sharma',
      email: `teacher_${Date.now()}@knwshare.dev`,
      password: 'password123',
      role: 'teacher'
    });

    const student1 = await User.create({
      name: 'Student One',
      email: `student1_${Date.now()}@knwshare.dev`,
      password: 'password123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: `student2_${Date.now()}@knwshare.dev`,
      password: 'password123',
      role: 'student'
    });

    // Create a real slot
    const slot = await AvailabilitySlot.create({
      teacherId: teacher._id,
      dayOfWeek: 'Tuesday',
      startTime: '10:00 AM',
      endTime: '10:45 AM',
      durationMinutes: 45,
      isRecurring: true,
      isBooked: false,
      isActive: true
    });

    console.log(`[Test Phase 3] Created slot ${slot._id} for teacher ${teacher.name}`);

    // 2. Perform concurrent booking requests for student1 and student2
    const m1 = mockReqRes({ slotId: slot._id.toString(), teacherId: teacher._id.toString() }, student1);
    const m2 = mockReqRes({ slotId: slot._id.toString(), teacherId: teacher._id.toString() }, student2);

    console.log('[Test Phase 3] Firing concurrent booking requests...');
    await Promise.all([
      createBooking(m1.req, m1.res, m1.next),
      createBooking(m2.req, m2.res, m2.next)
    ]);

    const results = [
      { student: 'Student 1', status: m1.getStatus(), data: m1.getData() },
      { student: 'Student 2', status: m2.getStatus(), data: m2.getData() }
    ];

    console.log('[Test Phase 3] Concurrent Booking Results:', results);

    const successCount = results.filter(r => r.status === 201).length;
    const conflictCount = results.filter(r => r.status === 409).length;

    if (successCount !== 1 || conflictCount !== 1) {
      throw new Error(`Race condition test failed! Expected 1 success (201) and 1 conflict (409), got ${successCount} successes and ${conflictCount} conflicts.`);
    }

    // Verify DB state
    const bookingsInDb = await Booking.find({ slotId: slot._id });
    if (bookingsInDb.length !== 1) {
      throw new Error(`Database corrupted! Found ${bookingsInDb.length} bookings for single slot.`);
    }

    console.log('✅ Gate Test 3 Passed: Exactly 1 concurrent booking succeeded, exactly 1 returned 409 Conflict. Database has exactly 1 booking record.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gate Test 3 Failed:', err.message);
    await disconnectDB();
    process.exit(1);
  }
}

testPhase3();
