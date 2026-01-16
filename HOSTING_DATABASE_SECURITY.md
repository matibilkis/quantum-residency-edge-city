# Hosting Online with Secure Database Access

## Your Question: Best way to host online and keep database private?

**Answer**: Deploy to **Railway.app** with password-protected admin access.

## ✅ I've Added Complete Security

Your database is now **fully protected**:

1. ✅ **Admin dashboard requires login** (username + password)
2. ✅ **Database API endpoints require authentication**
3. ✅ **Passwords are encrypted** (bcrypt hashing)
4. ✅ **Session management** (24-hour timeout)
5. ✅ **Rate limiting** (prevents spam)
6. ✅ **Only YOU have access** (set your own credentials)

## 🚀 Best Hosting Option: Railway.app

### Why Railway?
- **Simple**: 5-minute setup
- **Affordable**: ~$5/month
- **Automatic HTTPS**: SSL included
- **Private database**: Only accessible via your credentials
- **Easy backups**: Download database file anytime

### How to Deploy (5 minutes)

#### Step 1: Install dependencies locally first
```bash
npm install
```

#### Step 2: Set up YOUR credentials
Create a `.env` file:
```bash
ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=generate_this_with_command_below
NODE_ENV=production
```

Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 3: Test locally
```bash
npm start
```
- Visit: http://localhost:3000
- Test the form
- Login at: http://localhost:3000/login.html
- View dashboard: http://localhost:3000/admin.html

#### Step 4: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 5: Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your `quredge-landing` repository
6. Railway automatically deploys!

#### Step 6: Set Environment Variables in Railway
**CRITICAL**: This is where you ensure only YOU have access!

In Railway dashboard:
1. Click on your project
2. Go to "Variables" tab
3. Add these (with YOUR values):

```
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_strong_password_here
SESSION_SECRET=paste_generated_secret_here
NODE_ENV=production
```

#### Step 7: Get Your URL
1. Go to "Settings" tab
2. Under "Domains" → Click "Generate Domain"
3. You'll get: `your-project.up.railway.app`

### You're Live! 🎉

**Public access (anyone):**
- Landing page: `https://your-project.up.railway.app`
- Form submission: Anyone can fill out the form

**Private access (only YOU):**
- Admin login: `https://your-project.up.railway.app/login.html`
- Admin dashboard: Requires YOUR username/password
- Database: Only accessible when logged in

## 🔐 How Database Security Works

### What's Protected
```
┌─────────────────────────────────────────┐
│  Public (Anyone can access)             │
│  • Landing page                         │
│  • Interest form (submit only)          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Private (Only YOU after login)         │
│  • Admin dashboard                      │
│  • View all submissions                 │
│  • Download CSV exports                 │
│  • Database access                      │
│  • Statistics                           │
└─────────────────────────────────────────┘
```

### What Happens When Someone Tries to Access Database

**Without login:**
```
User → /admin.html
  ↓
System: "Not authenticated"
  ↓
Redirected → /login.html
```

**With wrong password:**
```
User → Login with wrong password
  ↓
System: "Invalid credentials"
  ↓
Access Denied ❌
```

**With YOUR credentials:**
```
You → Login with correct username/password
  ↓
System: Password matches (bcrypt verification)
  ↓
Creates encrypted session
  ↓
Access Granted ✅ → Admin Dashboard
```

## 📊 Accessing Your Data (Only YOU)

### Method 1: Admin Dashboard (Easiest)
1. Visit: `https://your-project.up.railway.app/login.html`
2. Login with YOUR credentials
3. View all submissions
4. Search/filter data
5. Export to CSV

### Method 2: Download Database File
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Download database
railway run 'cat quredge-interest.db' > backup.db

# Open locally
sqlite3 backup.db
```

### Method 3: Direct SQLite Query (on server)
```bash
railway run sqlite3 quredge-interest.db "SELECT * FROM interest_forms;"
```

## 🛡️ Security Features Active

### Password Protection
- ✅ Bcrypt encryption (10 rounds)
- ✅ Passwords never stored in plain text
- ✅ Secure session cookies

### Access Control
- ✅ Admin endpoints require authentication
- ✅ 24-hour session timeout
- ✅ Logout functionality

### Attack Prevention
- ✅ Rate limiting (5 form submissions per 15 min per IP)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Session hijacking protection (HTTP-only cookies)
- ✅ HTTPS (automatic on Railway)

## 💾 Backing Up Your Database

### Recommended: Weekly Backups

**Option 1: Manual Download (Easiest)**
```bash
# Every week, run:
railway run 'cat quredge-interest.db' > backup-$(date +%Y%m%d).db
```

**Option 2: Automated Script**
Create `backup.sh`:
```bash
#!/bin/bash
railway run 'cat quredge-interest.db' > backups/quredge-$(date +%Y%m%d).db
echo "Backup completed: quredge-$(date +%Y%m%d).db"
```

Run weekly:
```bash
chmod +x backup.sh
./backup.sh
```

**Option 3: Via Admin Dashboard**
1. Login to admin dashboard
2. Click "Export CSV"
3. Save file to your computer
4. Keep in secure location

## 🔒 Advanced Security (Optional)

### Additional Protection: IP Whitelisting

If you want to restrict admin access to ONLY your IP address:

Add to `server.js`:
```javascript
const allowedIPs = ['YOUR_IP_ADDRESS']; // Get from whatismyip.com

app.use('/admin*', (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).send('Access forbidden');
  }
  next();
});
```

### Additional Protection: Two-Factor Authentication

For maximum security, you could add 2FA using `speakeasy` package.

## 💰 Cost Breakdown

### Railway.app Pricing
- **Free Trial**: $5 credit/month (enough for testing)
- **Paid Plan**: $5-10/month (pay for usage)
  - Includes:
    - Automatic HTTPS
    - Unlimited deployments
    - 8GB RAM
    - Environment variables
    - 100GB bandwidth

### Your Expected Cost
For this project: **~$5-7/month**

## 🔧 Maintenance Tasks

### Weekly
- [ ] Backup database
- [ ] Check for new submissions
- [ ] Review for any errors in logs

### Monthly
- [ ] Download full CSV export
- [ ] Update npm dependencies: `npm update`
- [ ] Review submission trends

### As Needed
- [ ] Change password if compromised
- [ ] Add new admin users (requires code changes)
- [ ] Increase rate limits if needed

## ❓ FAQ

### Q: Can others see my database?
**A**: No! Only you can access it after logging in with your credentials.

### Q: What if I forget my password?
**A**: 
1. Go to Railway dashboard
2. Change the `ADMIN_PASSWORD` environment variable
3. Restart the app
4. Login with new password

### Q: Can someone hack my database?
**A**: Very unlikely with current security:
- Password hashing prevents password theft
- Session management prevents hijacking
- Rate limiting prevents brute force
- HTTPS prevents interception
- SQL injection is prevented

### Q: Where is my database stored?
**A**: On Railway's servers in a private file (`quredge-interest.db`). Only accessible via authenticated API calls.

### Q: Can I add more admins?
**A**: Currently single-user. For multiple admins, you'd need to:
- Add a users table
- Implement user management
- Or share the single login credentials (not recommended)

### Q: What if Railway shuts down?
**A**: Download your database backup and deploy elsewhere (DigitalOcean, Render, VPS). Your code works on any Node.js hosting.

## ✅ Final Security Checklist

Before going live:

- [ ] Changed `ADMIN_PASSWORD` to strong password (12+ chars)
- [ ] Generated random `SESSION_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Tested login locally
- [ ] Tested form submission
- [ ] Verified admin endpoints require auth
- [ ] Set up backup strategy
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Credentials stored in Railway (not in code)
- [ ] `.env` file NOT committed to Git

## 🎯 Summary

**Your database is secure because:**
1. ✅ Password-protected login required
2. ✅ Encrypted password storage
3. ✅ Only authenticated users can access database
4. ✅ HTTPS encrypts all traffic
5. ✅ Rate limiting prevents abuse
6. ✅ Session timeout after 24 hours
7. ✅ You control the credentials

**To access your data, you need:**
- The exact URL
- Your username (that you set)
- Your password (that you set)

**Nobody else can access it!** 🔒

---

## Next Steps

1. **Test locally**: `npm start`
2. **Set your credentials**: Edit `.env`
3. **Push to GitHub**: `git push`
4. **Deploy to Railway**: https://railway.app
5. **Set environment variables**: In Railway dashboard
6. **Test online**: Login and verify

You're all set! Your database is private and secure. 🎉

**Need help?** See:
- `QUICK_START_SECURE.md` - Quick setup
- `SECURITY.md` - Detailed security guide
- `DEPLOY_RAILWAY.md` - Step-by-step deployment

