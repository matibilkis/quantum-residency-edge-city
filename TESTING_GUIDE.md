# Automated Testing Guide

## Overview

This project includes comprehensive automated tests to ensure:
- ✅ Form submissions work correctly
- ✅ Database operations persist data
- ✅ Authentication protects admin endpoints
- ✅ No sensitive information is exposed
- ✅ Rate limiting works
- ✅ All API endpoints function properly

## Test Suite

### What Gets Tested

1. **Public Endpoints**
   - Landing page loads
   - Login page accessible
   - Form submission works

2. **Form Validation**
   - Required fields are enforced
   - Email format validation
   - Invalid data is rejected

3. **Authentication**
   - Login with valid credentials succeeds
   - Login with invalid credentials fails
   - Session management works
   - Logout clears session

4. **Protected Endpoints**
   - Admin endpoints require authentication
   - Unauthorized access is blocked
   - Authenticated access works

5. **Database Integration**
   - Form data persists to database
   - Data retrieval works
   - Statistics calculate correctly

6. **Rate Limiting**
   - 5 submissions allowed per 15 minutes
   - 6th submission is blocked

7. **Security**
   - No credentials exposed in responses
   - Sessions are properly secured
   - Admin data requires authentication

## Running Tests

### Install Test Dependencies

```bash
npm install
```

This installs:
- `jest` - Testing framework
- `supertest` - HTTP assertion library

### Run All Tests

```bash
npm test
```

**Output:**
```
PASS  tests/api.test.js
  Public Endpoints
    ✓ GET / should return landing page (45ms)
    ✓ GET /login.html should return login page (12ms)
  Form Submission (Public)
    ✓ POST /api/interest should accept valid form data (28ms)
    ✓ POST /api/interest should reject missing required fields (15ms)
    ✓ POST /api/interest should reject invalid email (18ms)
  Authentication
    ✓ POST /api/auth/login should accept valid credentials (32ms)
    ✓ POST /api/auth/login should reject invalid credentials (25ms)
  Protected Endpoints
    ✓ GET /api/admin/interest/all should require authentication (14ms)
    ✓ GET /api/admin/interest/all should return data when authenticated (22ms)
  ...

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

### Run Tests in Watch Mode

For development - re-runs tests when files change:

```bash
npm run test:watch
```

### Run Quick Tests (No Coverage)

```bash
npm run test:quick
```

### Run Tests with Coverage Report

```bash
npm test
```

Coverage report saved to `coverage/` directory.

## Test Database

**Important:** Tests use a **separate database** to avoid affecting your real data!

- Production DB: `quredge-interest.db`
- Test DB: `quredge-interest-test.db`

The test database is:
- Created automatically when tests run
- Deleted automatically after tests complete
- Never contains real user data

## Test Credentials

Tests use safe, non-production credentials:

```javascript
Username: test_admin
Password: test_password_123
Session Secret: test-session-secret
```

**These are ONLY used in tests** and never exposed publicly!

## Continuous Integration

### Running Tests Before Deploy

**Best practice:** Always run tests before deploying:

```bash
# 1. Run tests
npm test

# 2. If all pass, then deploy
git push origin main
# Deploy to Railway/etc.
```

### Automated Testing on GitHub

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm test
```

This runs tests automatically on every push!

## Understanding Test Results

### ✅ All Tests Pass

```
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

**Meaning:** Everything works! Safe to deploy.

### ❌ Some Tests Fail

```
FAIL  tests/api.test.js
  ● Authentication › POST /api/auth/login should accept valid credentials

    expect(received).toBe(expected)
    
    Expected: 200
    Received: 401
```

**Meaning:** Something is broken. Fix before deploying!

Common failures:
- `401` - Authentication not working
- `400` - Validation failing
- `500` - Server error

## Test Coverage

After running `npm test`, open coverage report:

```bash
# Open in browser
open coverage/lcov-report/index.html
```

**Goal:** Aim for >80% coverage on critical files:
- `server.js` - API endpoints
- `auth.js` - Authentication
- Critical frontend JavaScript

## Writing New Tests

### Example: Test a New Endpoint

```javascript
describe('New Feature', () => {
  test('should do something', async () => {
    const response = await request(server)
      .get('/api/new-endpoint')
      .expect(200);
    
    expect(response.body.data).toBeDefined();
  });
});
```

### Example: Test Authentication Required

```javascript
test('should require auth', async () => {
  // Without auth - should fail
  await request(server)
    .get('/api/protected')
    .expect(401);
    
  // With auth - should work
  const response = await request(server)
    .get('/api/protected')
    .set('Cookie', cookies)
    .expect(200);
});
```

## Security Testing

### What's Tested for Security

1. **Authentication Bypass Attempts**
   - Tests try to access admin endpoints without login
   - Tests verify wrong passwords are rejected

2. **SQL Injection Prevention**
   - Tests send malicious input
   - Parameterized queries prevent injection

3. **Rate Limiting**
   - Tests verify spam protection works
   - 6th rapid submission is blocked

4. **Session Security**
   - Tests verify sessions expire properly
   - Tests verify logout clears access

### What's NOT Exposed

Tests never expose:
- Real admin credentials
- Production database
- Real user data
- API secrets

## Troubleshooting

### Tests Fail: "EADDRINUSE"

**Problem:** Port already in use.

**Solution:** Stop your running server:
```bash
pkill -f "node.*server.js"
npm test
```

### Tests Fail: "Cannot find module"

**Problem:** Dependencies not installed.

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

### Tests Timeout

**Problem:** Database locked or server not responding.

**Solution:**
```bash
# Delete test database
rm quredge-interest-test.db
npm test
```

## Best Practices

### Before Every Deploy

```bash
# 1. Run tests
npm test

# 2. Check coverage
# (Should be >80% for critical files)

# 3. If all pass, deploy
```

### After Code Changes

```bash
# Run tests in watch mode while developing
npm run test:watch

# Make changes, save, tests re-run automatically
```

### Before Pull Requests

```bash
# Ensure all tests pass
npm test

# Check coverage hasn't decreased
# (Look at coverage/lcov-report/index.html)
```

## CI/CD Integration

### Railway

Railway can run tests before deployment:

1. Add to `package.json`:
```json
"scripts": {
  "build": "npm test"
}
```

2. Railway runs tests on every deploy
3. Deploy fails if tests fail ✅

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

## Test Results Interpretation

### Coverage Report

```
File           | % Stmts | % Branch | % Funcs | % Lines |
---------------|---------|----------|---------|---------|
server-test.js |   95.12 |    88.89 |   93.75 |   95.12 |
auth.js        |   92.31 |    85.71 |   90.00 |   92.31 |
```

**Good:** >80% on all metrics
**Acceptable:** >70% on all metrics
**Needs work:** <70% on any metric

## What's Verified

✅ **Functionality**
- Form submission works
- Database saves data
- Admin can view submissions
- Stats calculate correctly

✅ **Security**
- Authentication required for admin
- Wrong passwords rejected
- Sessions work properly
- Rate limiting active

✅ **Data Integrity**
- Submitted data persists correctly
- Required fields enforced
- Email validation works
- No data corruption

✅ **API Endpoints**
- Public endpoints accessible
- Protected endpoints secured
- Proper status codes returned
- Error messages appropriate

## Next Steps

1. **Run tests now:**
   ```bash
   npm test
   ```

2. **Review coverage:**
   ```bash
   open coverage/lcov-report/index.html
   ```

3. **Add to deploy workflow:**
   - Always run `npm test` before deploying
   - Only deploy if all tests pass

4. **Set up GitHub Actions** (optional):
   - Tests run automatically on push
   - Prevents bad code from being merged

---

## Quick Reference

```bash
# Run all tests
npm test

# Watch mode (for development)
npm run test:watch

# Quick tests (no coverage)
npm run test:quick

# View coverage report
open coverage/lcov-report/index.html

# Clean test database
rm quredge-interest-test.db
```

**Remember:** Tests use separate database and safe credentials. Your production data is never touched!
