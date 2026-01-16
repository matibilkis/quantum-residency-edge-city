# 🚀 Quick Start Guide - Secure Setup

## First Time Setup (2 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Your Credentials

**IMPORTANT**: The default credentials are:
- Username: `admin`
- Password: `quredge2026`

**Change these immediately!**

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=generate_random_32char_string
```

Generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the Server
```bash
npm start
```

Or use the quick start script:
```bash
./start.sh
```

## Access Your Site

### Landing Page (Public)
```
http://localhost:3000
```

### Admin Login
```
http://localhost:3000/login.html
```

Login with the credentials you set in `.env`

### Admin Dashboard
```
http://localhost:3000/admin.html
```
(Requires login)

## Testing the Form

1. Visit http://localhost:3000
2. Click "Stay tuned!" button
3. Fill out the form
4. Submit
5. Go to admin dashboard to see the submission

## Deploying Online (5 minutes)

### Recommended: Railway.app

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub"
   - Select your repo
   - Railway auto-deploys!

3. **Set Environment Variables:**
   In Railway dashboard → Variables, add:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   SESSION_SECRET=your_random_secret
   NODE_ENV=production
   ```

4. **Get Your URL:**
   - Settings → Domains → Generate Domain
   - You'll get: `your-project.up.railway.app`

5. **Done!** 🎉
   - Landing page: `https://your-project.up.railway.app`
   - Admin login: `https://your-project.up.railway.app/login.html`

## Important Files

- `server.js` - Backend server with API
- `auth.js` - Authentication system
- `index.html` - Landing page with form
- `login.html` - Admin login page
- `admin.html` - Admin dashboard
- `.env` - Your credentials (never commit this!)
- `quredge-interest.db` - Database (auto-created)

## Security Features

✅ **Password protected admin area**
✅ **Encrypted sessions**
✅ **Rate limiting on form submissions**
✅ **HTTPS (automatic on Railway)**
✅ **Database access restricted to authenticated users**

## Quick Commands

```bash
# Start server
npm start

# Start with custom port
PORT=8080 npm start

# View database
sqlite3 quredge-interest.db "SELECT * FROM interest_forms;"

# Backup database
cp quredge-interest.db backups/backup-$(date +%Y%m%d).db

# Generate new session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Common Issues

### "Authentication required" error
- Make sure you're logged in at `/login.html`
- Check your credentials in `.env`

### Form not submitting
- Check browser console for errors
- Verify server is running
- Check `npm start` terminal for errors

### Can't access admin dashboard
- Visit `/login.html` first
- Use credentials from `.env` file
- Clear browser cookies and try again

## Default Credentials (If no .env file)

**⚠️ WARNING: Only for local testing!**
- Username: `admin`
- Password: `quredge2026`

**Change these before deploying!**

## Need Help?

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Security Guide**: See `SECURITY.md`
- **Deployment Guide**: See `DEPLOY_RAILWAY.md`
- **Form Details**: See `README_FORM.md`

---

## Next Steps

1. ✅ Set up credentials
2. ✅ Test locally
3. ✅ Deploy to Railway
4. ✅ Set environment variables
5. ✅ Test online
6. ✅ Share with team!

**You're all set! 🚀**

