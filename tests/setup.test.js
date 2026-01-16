// Test Setup and Configuration
const fs = require('fs');
const path = require('path');

// Use a separate test database
process.env.TEST_DB = 'quredge-interest-test.db';
process.env.ADMIN_USERNAME = 'test_admin';
process.env.ADMIN_PASSWORD = 'test_password_123';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.NODE_ENV = 'test';

// Clean up test database before tests
beforeAll(() => {
  const testDbPath = path.join(__dirname, '..', process.env.TEST_DB);
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

// Clean up test database after all tests
afterAll(() => {
  const testDbPath = path.join(__dirname, '..', process.env.TEST_DB);
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

// Add a dummy test so Jest doesn't complain
test('Test environment is configured', () => {
  expect(process.env.NODE_ENV).toBe('test');
  expect(process.env.TEST_DB).toBeDefined();
  expect(process.env.ADMIN_USERNAME).toBeDefined();
});

module.exports = {
  testDb: process.env.TEST_DB,
  testAdmin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  }
};

