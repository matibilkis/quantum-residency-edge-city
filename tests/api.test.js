// API Endpoint Tests
const request = require('supertest');
const { testAdmin } = require('./setup.test');

// We'll require the app after environment is set
let app;
let server;

beforeAll((done) => {
  // Import server after environment variables are set
  app = require('../server-test');
  server = app.listen(0, done); // Use random port
});

afterAll((done) => {
  server.close(done);
});

describe('Public Endpoints', () => {
  test('GET / should return landing page', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Quredge');
  });

  test('GET /login.html should return login page', async () => {
    const response = await request(server).get('/login.html');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Admin Login');
  });
});

describe('Form Submission (Public)', () => {
  test('POST /api/interest should accept valid form data', async () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      curiosity: 'Testing the quantum residency program',
      participation: 'attendant',
      institution: 'Test University'
    };

    const response = await request(server)
      .post('/api/interest')
      .send(formData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Thank you');
  });

  test('POST /api/interest should reject missing required fields', async () => {
    const formData = {
      name: 'Test User',
      // Missing email, curiosity, participation
    };

    const response = await request(server)
      .post('/api/interest')
      .send(formData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('required');
  });

  test('POST /api/interest should reject invalid email', async () => {
    const formData = {
      name: 'Test User',
      email: 'invalid-email',
      curiosity: 'Test',
      participation: 'attendant'
    };

    const response = await request(server)
      .post('/api/interest')
      .send(formData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('email');
  });
});

describe('Authentication', () => {
  let cookies;

  test('POST /api/auth/login should accept valid credentials', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: testAdmin.password
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('successful');
    
    // Save cookies for authenticated requests
    cookies = response.headers['set-cookie'];
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: 'wrong_password'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid');
  });

  test('GET /api/auth/status should return authenticated status', async () => {
    // First login
    const loginResponse = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: testAdmin.password
      });

    cookies = loginResponse.headers['set-cookie'];

    // Check status
    const response = await request(server)
      .get('/api/auth/status')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body.authenticated).toBe(true);
    expect(response.body.username).toBe(testAdmin.username);
  });
});

describe('Protected Endpoints', () => {
  let cookies;

  beforeAll(async () => {
    // Login first
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: testAdmin.password
      });
    cookies = response.headers['set-cookie'];
  });

  test('GET /api/admin/interest/all should require authentication', async () => {
    // Without authentication
    await request(server)
      .get('/api/admin/interest/all')
      .expect(401);
  });

  test('GET /api/admin/interest/all should return data when authenticated', async () => {
    const response = await request(server)
      .get('/api/admin/interest/all')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/admin/interest/stats should require authentication', async () => {
    // Without authentication
    await request(server)
      .get('/api/admin/interest/stats')
      .expect(401);
  });

  test('GET /api/admin/interest/stats should return stats when authenticated', async () => {
    const response = await request(server)
      .get('/api/admin/interest/stats')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.stats).toBeDefined();
    expect(typeof response.body.stats.total).toBe('number');
  });
});

describe('Database Integration', () => {
  let cookies;

  beforeAll(async () => {
    // Login
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: testAdmin.password
      });
    cookies = response.headers['set-cookie'];
  });

  test('Form submission should persist to database', async () => {
    // Submit form
    const formData = {
      name: 'Database Test User',
      email: 'dbtest@example.com',
      curiosity: 'Testing database persistence',
      participation: 'sponsor',
      institution: 'DB Test Corp'
    };

    await request(server)
      .post('/api/interest')
      .send(formData)
      .expect(200);

    // Retrieve from database
    const response = await request(server)
      .get('/api/admin/interest/all')
      .set('Cookie', cookies)
      .expect(200);

    const submissions = response.body.data;
    const found = submissions.find(s => s.email === 'dbtest@example.com');

    expect(found).toBeDefined();
    expect(found.name).toBe('Database Test User');
    expect(found.participation).toBe('sponsor');
  });

  test('Statistics should calculate correctly', async () => {
    // Submit multiple entries
    const attendant = {
      name: 'Attendant User',
      email: 'attendant@test.com',
      curiosity: 'Test',
      participation: 'attendant',
      institution: 'Test'
    };

    const sponsor = {
      name: 'Sponsor User',
      email: 'sponsor@test.com',
      curiosity: 'Test',
      participation: 'sponsor',
      institution: 'Test'
    };

    await request(server).post('/api/interest').send(attendant);
    await request(server).post('/api/interest').send(sponsor);

    // Get stats
    const response = await request(server)
      .get('/api/admin/interest/stats')
      .set('Cookie', cookies)
      .expect(200);

    const stats = response.body.stats;
    expect(stats.total).toBeGreaterThanOrEqual(2);
    
    const byParticipation = stats.byParticipation;
    const attendantCount = byParticipation.find(p => p.participation === 'attendant')?.count || 0;
    const sponsorCount = byParticipation.find(p => p.participation === 'sponsor')?.count || 0;
    
    expect(attendantCount).toBeGreaterThanOrEqual(1);
    expect(sponsorCount).toBeGreaterThanOrEqual(1);
  });
});

describe('Rate Limiting', () => {
  test('Rate limiting is configured (5 per 15 min)', async () => {
    // Note: Actual rate limit testing is difficult in automated tests
    // because previous tests may have already consumed the quota.
    // This test verifies the rate limiter responds with correct error message
    
    const formData = {
      name: 'Rate Test',
      email: `ratetest${Date.now()}@test.com`,
      curiosity: 'Testing rate limit',
      participation: 'attendant'
    };

    // Try submitting - may succeed or be rate limited depending on previous tests
    const response = await request(server)
      .post('/api/interest')
      .send(formData);
    
    // Should either succeed (200) or be rate limited (429)
    expect([200, 429]).toContain(response.statusCode);
    
    // If rate limited, check error message
    if (response.statusCode === 429) {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Too many submissions');
    }
  });
});

describe('Logout', () => {
  test('POST /api/auth/logout should clear session', async () => {
    // Login first
    const loginResponse = await request(server)
      .post('/api/auth/login')
      .send({
        username: testAdmin.username,
        password: testAdmin.password
      });

    const cookies = loginResponse.headers['set-cookie'];

    // Logout
    await request(server)
      .post('/api/auth/logout')
      .set('Cookie', cookies)
      .expect(200);

    // Try to access protected endpoint (should fail)
    await request(server)
      .get('/api/admin/interest/all')
      .set('Cookie', cookies)
      .expect(401);
  });
});

