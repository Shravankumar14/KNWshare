import http from 'http';
import dotenv from 'dotenv';
import app from '../server.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

const PORT = 5055;

const runHttpTests = async () => {
  console.log('====================================================');
  console.log('🌐 Running Live HTTP Multi-Goal API Endpoint Verification');
  console.log('====================================================');

  const server = app.listen(PORT, '127.0.0.1');

  const request = (path) => {
    return new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      req.on('error', reject);
    });
  };

  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.body.status === 'ok', 'GET /health returns 200 ok');

    // 2. GET /api/goals
    const goalsRes = await request('/api/goals');
    assert(goalsRes.status === 200, 'GET /api/goals returns 200');
    assert(goalsRes.body.data?.length >= 4, `GET /api/goals returned ${goalsRes.body.data?.length} goals`);

    // 3. GET /api/goals/:goalSlug/roadmap for each of the 4 goals
    const testGoals = [
      'jee-main-advanced',
      'full-stack-development',
      'competitive-programming-dsa',
      'machine-learning-ai'
    ];

    for (const slug of testGoals) {
      const roadRes = await request(`/api/goals/${slug}/roadmap`);
      assert(roadRes.status === 200, `GET /api/goals/${slug}/roadmap returns 200`);
      assert(
        roadRes.body.data?.roadmap?.stages?.length >= 3,
        `Roadmap for ${slug} has ${roadRes.body.data?.roadmap?.stages?.length} stages`
      );
      assert(
        roadRes.body.data?.goal?.slug === slug,
        `Returned goal slug matches '${slug}' without cross-goal fallback`
      );
    }

    // 4. Test non-existent goal slug (must return 404, never fallback!)
    const invalidGoalRes = await request('/api/goals/non-existent-career/roadmap');
    assert(invalidGoalRes.status === 404, 'GET invalid goal returns 404 (zero fallback verified)');

    // 5. Test filtered resources
    const mlResources = await request('/api/resources?goal=machine-learning-ai');
    assert(mlResources.status === 200, 'GET /api/resources?goal=machine-learning-ai returns 200');
    assert(mlResources.body.data?.length > 0, `Returned ${mlResources.body.data?.length} resources for ML`);

    const cpResources = await request('/api/resources?goal=competitive-programming-dsa');
    assert(cpResources.status === 200, 'GET /api/resources?goal=competitive-programming-dsa returns 200');
    assert(cpResources.body.data?.length > 0, `Returned ${cpResources.body.data?.length} resources for CP`);

    // 6. Test Free/Paid filtering
    const freeResources = await request('/api/resources?goal=jee-main-advanced&free=true');
    assert(freeResources.status === 200, 'GET /api/resources with free=true filter returns 200');
    const allFree = freeResources.body.data?.every((r) => r.free === true || r.isFree === true);
    assert(allFree, 'All returned resources match free=true');

  } catch (err) {
    console.error('HTTP Test Failure:', err);
    failed++;
  } finally {
    server.close();
    await disconnectDB();
  }

  console.log('====================================================');
  console.log(`HTTP Test Results: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
};

runHttpTests();
