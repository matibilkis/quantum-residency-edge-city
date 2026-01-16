# 🚀 Safe Deployment Checklist - Quredge Landing Page

## ⚠️ CRITICAL: Complete ALL Steps Before Deploying

---

## 📋 COMPLETE DEPLOYMENT STEPS

### STEP 1: Generate New Security Credentials ✅

#### 1.1 Generate Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Save this output** - you'll need it as `SESSION_SECRET`

#### 1.2 Create Strong Admin Password
Requirements:
- ✅ 16+ characters
- ✅ Mix of uppercase, lowercase, numbers, symbols  
- ✅ NOT based on "quredge" or "quantum"
- ✅ Keep completely private

Example: `Qr$7mK9#nP2wXz5L!aB8vD4`

#### 1.3 Create Strong Viewer Password
Requirements:
- ✅ 12+ characters
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ✅ Share only with trusted co-organizers

Example: `V!ew3r#2026$QurEdge`

---

### STEP 2: Choose Hosting Platform 🎯

#### Option A: Vercel (⚠️ Not Recommended for SQLite)
- **PRO**: Fast, free, easy custom domains
- **CON**: SQLite doesn't persist (data will be lost!)
- **Solution**: Must migrate to Postgres
- **Guide**: See `VERCEL_DEPLOYMENT.md`

#### Option B: Railway.app (⭐ RECOMMENDED)
- **PRO**: SQLite works perfectly, free tier, simple
- **CON**: None for this project
- **Cost**: Free ($5 credit/month)
- **Guide**: See `DEPLOY_RAILWAY.md`

#### Option C: Render.com
- **PRO**: Free tier, persistent disk
- **CON**: Sleeps after inactivity on free tier
- **Cost**: Free tier or $7/month

#### Option D: DigitalOcean App Platform
- **PRO**: Very reliable, good docs
- **CON**: No free tier
- **Cost**: $5-12/month

**RECOMMENDATION: Use Railway for easiest SQLite support**

---

### STEP 3: Prepare Code for Deployment 🔧

#### 3.1 Verify .gitignore
```bash
cat .gitignore | grep -E "\.env|\.db"
```
Should see:
- `.env`
- `*.db`

✅ Already configured correctly!

#### 3.2 Check if using auth-roles.js (for viewer access)

Current status: You have `auth-roles.js` for multi-user support

**Do you want viewer (read-only) access for co-organizers?**

**YES** (Recommended):
- Uses `auth-roles.js` ✅ (already in project)
- Server.js uses: `const auth = require('./auth-roles');`
- Need to set: `VIEWER_USERNAME` and `VIEWER_PASSWORD`

**NO** (Admin only):
- Uses `auth.js`
- Server.js uses: `const auth = require('./auth');`
- Only need: `ADMIN_USERNAME` and `ADMIN_PASSWORD`

Currently server.js uses: `auth.js` (single admin only)

---

### STEP 4: Set Environment Variables (On Hosting Platform) 🔐

**For Railway, Render, DigitalOcean:**

```bash
# Required for Admin-Only
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password_here
SESSION_SECRET=your_generated_session_secret_here
NODE_ENV=production

# Additional for Viewer Access (if using auth-roles.js)
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=your_secure_viewer_password_here
```

**NEVER put these in code or commit to Git!**

---

### STEP 5: Deploy 🚀

#### For Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Set environment variables
railway variables set ADMIN_USERNAME=admin
railway variables set ADMIN_PASSWORD=your_secure_password
railway variables set SESSION_SECRET=your_session_secret
railway variables set NODE_ENV=production

# If using viewer access:
railway variables set VIEWER_USERNAME=coorganizer
railway variables set VIEWER_PASSWORD=your_viewer_password

# Get your URL
railway domain
```

#### For Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in dashboard
# (Settings → Environment Variables)

# Deploy to production
vercel --prod
```

#### For Render:
1. Connect GitHub repo
2. Add environment variables in dashboard
3. Click "Deploy"

---

### STEP 6: Post-Deployment Testing ✅

Test in this order:

#### 6.1 Public Pages
- [ ] Landing page loads: `https://your-domain.com`
- [ ] All sections visible
- [ ] Animations work
- [ ] Mobile responsive
- [ ] No console errors

#### 6.2 Form Submission
- [ ] Fill out interest form
- [ ] Submit successfully
- [ ] Receive confirmation message

#### 6.3 Admin Login
- [ ] Go to: `https://your-domain.com/login.html`
- [ ] Login with admin credentials
- [ ] Redirected to admin dashboard
- [ ] Can see submitted forms
- [ ] Can view statistics
- [ ] Can export CSV
- [ ] Logout works

#### 6.4 Viewer Login (if using auth-roles)
- [ ] Login with viewer credentials
- [ ] Can see submissions
- [ ] Can see statistics
- [ ] Cannot export CSV (button hidden)
- [ ] Cannot delete data
- [ ] Logout works

---

### STEP 7: Share Access with Co-Organizers 👥

#### For Admin (You Only):
```
Quredge Admin Dashboard - Full Access

URL: https://your-domain.com/login.html
Username: admin
Password: [your admin password]

KEEP THIS PRIVATE! This gives full access to modify/delete data.
```

#### For Viewers (Co-Organizers):
```
Quredge Admin Dashboard - Read-Only Access

URL: https://your-domain.com/login.html
Username: coorganizer
Password: [your viewer password]

Note: This is read-only access. You can view submissions 
and statistics but cannot modify or export data.
```

**NEVER SHARE:**
- ❌ Admin password
- ❌ SESSION_SECRET
- ❌ Database file
- ❌ Environment variables

---

### STEP 8: Set Up Backups 💾

#### For Railway:
- Automatic volume backups included
- Can also manually export database via dashboard

#### For Render:
- Enable persistent disk
- Set up daily backups in dashboard

#### Manual Backup (Any Platform):
```bash
# Download database file (if accessible)
# Export data via admin dashboard (CSV)
```

**Set a reminder: Back up data weekly!**

---

### STEP 9: Monitor and Maintain 📊

#### Weekly Tasks:
- [ ] Check form submissions
- [ ] Review analytics (if available)
- [ ] Test login still works
- [ ] Backup database

#### Monthly Tasks:
- [ ] Review and rotate passwords if team changes
- [ ] Update dependencies: `npm audit fix`
- [ ] Check for security updates

#### When Someone Leaves Team:
- [ ] Change VIEWER_PASSWORD
- [ ] Update in hosting dashboard
- [ ] Share new password with remaining team

---

## 🔒 SECURITY CHECKLIST

Before marking as complete:

### Credentials:
- [ ] ✅ Generated new SESSION_SECRET (32+ chars)
- [ ] ✅ Created strong ADMIN_PASSWORD (16+ chars)
- [ ] ✅ Created strong VIEWER_PASSWORD (12+ chars) *if using viewer access*
- [ ] ✅ Changed from ALL default passwords
- [ ] ✅ Passwords saved securely (password manager)

### Environment:
- [ ] ✅ All secrets set in hosting dashboard (not in code)
- [ ] ✅ `.env` files in `.gitignore`
- [ ] ✅ No secrets committed to Git
- [ ] ✅ NODE_ENV=production set

### Testing:
- [ ] ✅ All tests passing locally (`npm test`)
- [ ] ✅ Landing page works
- [ ] ✅ Form submission works
- [ ] ✅ Admin login works
- [ ] ✅ Viewer login works (if applicable)
- [ ] ✅ HTTPS enabled (automatic on most platforms)
- [ ] ✅ Mobile responsive

### Access Control:
- [ ] ✅ Admin credentials kept private
- [ ] ✅ Viewer credentials shared only with trusted co-organizers
- [ ] ✅ Tested role permissions (admin vs viewer)
- [ ] ✅ Logout functionality works

### Backup & Monitoring:
- [ ] ✅ Backup strategy in place
- [ ] ✅ Set reminder for weekly backups
- [ ] ✅ Know how to export data
- [ ] ✅ Monitoring/logging enabled

---

## 🎯 QUICK REFERENCE

### Current Project Status:
- ✅ Tests passing (18/18)
- ✅ Authentication system ready
- ✅ Rate limiting configured
- ✅ HTTPS-ready
- ⚠️ Currently using `auth.js` (admin-only)
- 💡 `auth-roles.js` available (for viewer access)

### To Enable Viewer Access:
1. Edit `server.js` line 11:
   ```javascript
   // Change from:
   const auth = require('./auth');
   
   // To:
   const auth = require('./auth-roles');
   ```
2. Add `VIEWER_USERNAME` and `VIEWER_PASSWORD` environment variables
3. Redeploy

### Essential URLs After Deployment:
- Landing: `https://your-domain.com`
- Login: `https://your-domain.com/login.html`
- Admin: `https://your-domain.com/admin.html`

### Essential Commands:
```bash
# Run tests
npm test

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Railway deploy
railway up

# Vercel deploy
vercel --prod

# Check environment variables (Railway)
railway variables

# View logs (Railway)
railway logs
```

---

## ❓ DECISION TREE

### Do you want co-organizers to have read-only access?

**YES** → 
1. Change `server.js` to use `auth-roles.js`
2. Set 4 environment variables (admin + viewer)
3. Share viewer credentials with co-organizers

**NO** → 
1. Keep `server.js` using `auth.js`
2. Set 3 environment variables (admin only)
3. Only you have access

### Which hosting platform?

**Need SQLite to work out-of-the-box?** → Railway or Render

**Want custom domains easily?** → Vercel (but migrate to Postgres)

**Want maximum reliability?** → DigitalOcean App Platform

**Free tier?** → Railway or Render

**My recommendation: Railway** ⭐

---

## ✅ FINAL PRE-DEPLOYMENT CHECKLIST

Print this and check each box:

```
SECURITY:
[ ] Generated new SESSION_SECRET (32+ chars)
[ ] Created strong ADMIN_PASSWORD (16+ chars)  
[ ] Created strong VIEWER_PASSWORD (12+ chars) if needed
[ ] All credentials saved in password manager
[ ] No secrets in code
[ ] .env in .gitignore

CODE PREPARATION:
[ ] All tests passing (npm test)
[ ] Decided: Admin-only OR Admin+Viewer?
[ ] If viewer: Changed server.js to auth-roles.js
[ ] No console.log sensitive data
[ ] Database file in .gitignore

DEPLOYMENT:
[ ] Hosting platform chosen
[ ] Environment variables set in platform dashboard
[ ] Deployed successfully
[ ] HTTPS enabled (automatic)

TESTING:
[ ] Landing page loads
[ ] Form submission works
[ ] Admin login works
[ ] Admin dashboard functional
[ ] Viewer login works (if applicable)
[ ] Viewer has read-only access (if applicable)
[ ] Mobile responsive
[ ] No console errors

POST-DEPLOYMENT:
[ ] Admin credentials saved privately
[ ] Viewer credentials shared with team (if applicable)
[ ] Backup strategy in place
[ ] Weekly backup reminder set
[ ] Team knows how to report issues

DOCUMENTATION:
[ ] Saved production URL
[ ] Saved admin credentials (private)
[ ] Saved viewer credentials (shareable)
[ ] Know how to rotate passwords
[ ] Know how to export database
```

---

## 🎉 YOU'RE READY!

Once all boxes are checked, you're ready for a safe deployment!

**Estimated time to deploy: 15-30 minutes**

Good luck! 🚀

