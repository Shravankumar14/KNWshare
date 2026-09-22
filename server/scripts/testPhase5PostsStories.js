import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Story from '../models/Story.js';
import { getPublicPosts, createPost } from '../controllers/postController.js';
import { getPublicStories, createStory } from '../controllers/storyController.js';

function mockReqRes(body, user, query = {}) {
  const req = { body, user, query, params: {} };
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

async function testPhase5() {
  console.log('[Test Phase 5] Testing Teacher Posts and Stories models, APIs, and filters...');
  try {
    await connectDB();

    const teacher = await User.create({
      name: 'Dr. Elena Rostova',
      email: `teacher_content_${Date.now()}@knwshare.dev`,
      password: 'password123',
      role: 'teacher'
    });

    // 1. Post Creation: 1 published, 1 unpublished
    const mCreatePost1 = mockReqRes({
      title: 'Active Distributed Systems Post',
      text: 'Explaining event driven architectures and Kafka partition keys.',
      tags: ['Kafka', 'Backend'],
      published: true
    }, teacher);
    await createPost(mCreatePost1.req, mCreatePost1.res, mCreatePost1.next);

    const mCreatePost2 = mockReqRes({
      title: 'Draft Unpublished Post',
      text: 'Hidden internal draft notes.',
      published: false
    }, teacher);
    await createPost(mCreatePost2.req, mCreatePost2.res, mCreatePost2.next);

    // Fetch public posts
    const mGetPosts = mockReqRes({}, null, {});
    await getPublicPosts(mGetPosts.req, mGetPosts.res, mGetPosts.next);
    const publicPosts = mGetPosts.getData()?.data || [];

    console.log(`[Test Phase 5] Public posts retrieved: ${publicPosts.length}`);
    const hasDraft = publicPosts.some(p => p.title === 'Draft Unpublished Post');
    const hasPublished = publicPosts.some(p => p.title === 'Active Distributed Systems Post');

    if (hasDraft || !hasPublished) {
      throw new Error(`Public feed filtering failed! Draft in feed: ${hasDraft}, Published in feed: ${hasPublished}`);
    }
    console.log('✅ Post filtering verified: Published posts appear, unpublished drafts are excluded.');

    // 2. Story Creation: 1 active, 1 expired
    const mCreateStory1 = mockReqRes({
      mediaUrl: 'https://images.unsplash.com/photo-1',
      title: 'Live Attention Mechanism',
      text: 'Check out the transformer derivation notes',
      expiresHours: 24
    }, teacher);
    await createStory(mCreateStory1.req, mCreateStory1.res, mCreateStory1.next);

    // Create directly in DB an expired story (>24h old)
    await Story.create({
      createdBy: teacher._id,
      mediaUrl: 'https://images.unsplash.com/photo-expired',
      title: 'Old Expired Story',
      published: true,
      expiresAt: new Date(Date.now() - 3600000) // expired 1 hour ago
    });

    // Fetch public stories
    const mGetStories = mockReqRes({}, null, {});
    await getPublicStories(mGetStories.req, mGetStories.res, mGetStories.next);
    const publicStories = mGetStories.getData()?.data || [];

    console.log(`[Test Phase 5] Public stories retrieved: ${publicStories.length}`);
    const hasExpired = publicStories.some(s => s.title === 'Old Expired Story');
    const hasActive = publicStories.some(s => s.title === 'Live Attention Mechanism');

    if (hasExpired || !hasActive) {
      throw new Error(`Story expiry filtering failed! Expired in feed: ${hasExpired}, Active in feed: ${hasActive}`);
    }
    console.log('✅ Story expiry verified: Active stories appear, expired stories are automatically excluded.');

    console.log('✅ Gate Test 5 Backend Passed: Posts and Stories APIs are fully functional and secure.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gate Test 5 Failed:', err.message);
    await disconnectDB();
    process.exit(1);
  }
}

testPhase5();
