# Security Guide - Quredge Landing Page

## 🔐 Authentication System

Your admin dashboard and database are now protected with a secure authentication system!

## Default Credentials (CHANGE THESE!)

**⚠️ IMPORTANT: Change these before deploying!**

- **Username**: `admin`
- **Password**: `quredge2026`

## Setting Up Your Credentials

### Option 1: Using Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit with your preferred editor
nano .env
```

Then set your credentials:

```bash
ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=generate_random_string_here
```

**To generate a secure session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 2: Set Environment Variables Directly

**On Linux/Mac:**
```bash
export ADMIN_USERNAME="your_username"
export ADMIN_PASSWORD="your_secure_password"
export SESSION_SECRET="your_random_secret"
npm start
```

**On Windows:**
```cmd
set ADMIN_USERNAME=your_username
set ADMIN_PASSWORD=your_secure_password
set SESSION_SECRET=your_random_secret
npm start
```

### Option 3: For Hosting Platforms (Railway, Heroku, etc.)

Add these as environment variables in your platform's dashboard:

- `ADMIN_USERNAME` = your username
- `ADMIN_PASSWORD` = your secure password
- `SESSION_SECRET` = random string (32+ characters)
- `NODE_ENV` = production

## Security Features Implemented

### ✅ Password Security
- Passwords are hashed using bcrypt (10 rounds)
- Never stored in plain text
- Secure session management

### ✅ Session Management
- 24-hour session expiration
- HTTP-only cookies (prevents XSS attacks)
- Secure cookies in production (HTTPS only)

### ✅ Rate Limiting
- Form submissions: 5 per 15 minutes per IP
- Prevents spam and abuse

### ✅ Protected Endpoints
- `/admin.html` - Requires login
- `/api/admin/interest/all` - Requires authentication
- `/api/admin/interest/stats` - Requires authentication

### ✅ Public Endpoints
- `/` - Landing page (public)
- `/api/interest` - Form submission (public, rate-limited)
- `/login.html` - Login page (public)

## Access Your Admin Dashboard

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Visit the login page:**
   ```
   http://localhost:3000/login.html
   ```

3. **Login with your credentials**

4. **Access admin dashboard:**
   - You'll be automatically redirected after successful login
   - Or visit: `http://localhost:3000/admin.html`

## Password Best Practices

### ✅ Good Passwords:
- At least 12 characters long
- Mix of uppercase, lowercase, numbers, symbols
- Not related to "quredge" or "quantum"
- Example: `Qr$7mK9#nP2wXz5L`

### ❌ Avoid:
- Common words or phrases
- Default passwords
- Short passwords (<8 characters)
- Personal information

## Deployment Security Checklist

Before deploying to production:

- [ ] Change default username and password
- [ ] Generate random SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure environment variables on hosting platform
- [ ] Test login functionality
- [ ] Verify admin endpoints are protected
- [ ] Test logout functionality
- [ ] Set up database backups
- [ ] Consider IP whitelisting for extra security (optional)

## Additional Security Measures (Optional)

### 1. IP Whitelisting
Restrict admin access to specific IP addresses:

```javascript
// Add to server.js
const allowedIPs = ['YOUR_IP_ADDRESS'];

app.use('/admin*', (req, res, next) => {
  const clientIP = req.ip;
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

### 2. Two-Factor Authentication
For even more security, consider adding 2FA using packages like:
- `speakeasy` - TOTP 2FA
- `qrcode` - QR code generation

### 3. Login Attempt Limiting
Already implemented via rate limiting, but you can make it stricter:

```javascript
// In server.js, adjust formLimiter configuration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // 3 failed attempts per 15 minutes
  skipSuccessfulRequests: true
});
```

## Backing Up Your Database

### Method 1: Manual Backup
```bash
# Copy the database file
cp quredge-interest.db backups/quredge-interest-$(date +%Y%m%d).db
```

### Method 2: Automated Daily Backup
Create a cron job (Linux/Mac):

```bash
# Edit crontab
crontab -e

# Add this line (backs up at 2 AM daily)
0 2 * * * cp /path/to/quredge-interest.db /path/to/backups/quredge-interest-$(date +\%Y\%m\%d).db
```

### Method 3: Platform Backups
Most hosting platforms offer automatic backups:
- **Railway**: Automatic volume backups
- **DigitalOcean**: Droplet backups available
- **Heroku**: Automated backups with Postgres

## Monitoring Access

### View Recent Logins
Check your server logs for login attempts:

```bash
# If using PM2
pm2 logs quredge-landing

# Standard node logs
# Look for authentication attempts in console output
```

### Add Logging (Optional)
To track login attempts, add to `auth.js`:

```javascript
console.log(`[${new Date().toISOString()}] Login attempt - Username: ${username}, Success: ${isValid}`);
```

## Troubleshooting

### Can't Login - Forgot Password
1. Stop the server
2. Edit `.env` file and change `ADMIN_PASSWORD`
3. Restart the server
4. Try logging in with new password

### Session Expires Too Quickly
Increase session duration in `server.js`:

```javascript
cookie: {
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days instead of 24 hours
}
```

### "Authentication Required" Error
1. Check if you're logged in
2. Try logging out and back in
3. Clear browser cookies
4. Check server logs for errors

## Support

For security concerns or questions:
- Email: quredge-team@edge.city
- Review code in `auth.js` and `server.js`

---

**Remember**: Security is an ongoing process. Keep your dependencies updated and monitor for any suspicious activity!

