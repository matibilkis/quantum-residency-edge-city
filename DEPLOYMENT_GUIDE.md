# Deployment Guide - Hosting Quredge Landing Page

## 🔐 Security First: Protecting Your Database

**CRITICAL**: Before deploying, we need to add authentication to protect the admin dashboard and database access.

## Recommended Hosting Options

### Option 1: DigitalOcean App Platform (RECOMMENDED) 💎
**Best for**: Simplicity + Full control + Database security

**Pros:**
- Easy to deploy
- Automatic HTTPS
- Built-in database options
- $5-12/month
- Full control over environment variables
- Can add password protection easily

**Steps:**
1. Create DigitalOcean account
2. Use App Platform
3. Connect your GitHub repo (or upload code)
4. Set environment variables (see below)
5. Deploy!

**Cost**: ~$5-12/month

---

### Option 2: Railway.app 🚂
**Best for**: Fastest deployment

**Pros:**
- Extremely simple deployment
- Free tier available ($5 credit/month)
- Automatic HTTPS
- GitHub integration
- One-click deploy

**Steps:**
1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy automatically

**Cost**: Free tier, then $5-10/month

---

### Option 3: Traditional VPS (DigitalOcean Droplet, Linode, AWS EC2)
**Best for**: Maximum control

**Pros:**
- Full control
- Can run multiple apps
- More configuration options

**Cons:**
- Requires more setup (Nginx, SSL, PM2)
- Need to manage server security

**Cost**: $5-10/month

---

### Option 4: Render.com
**Best for**: Simple, with free tier

**Pros:**
- Free tier available
- Easy deployment
- Automatic HTTPS

**Cons:**
- Free tier sleeps after inactivity
- Paid tier is $7/month

---

## 🔐 Adding Authentication (REQUIRED!)

### Option A: Simple Password Protection (Quick & Effective)

I'll create this for you - it adds a login system to protect admin endpoints.

### Option B: HTTP Basic Auth (Simplest)

Add this to protect specific routes with username/password.

### Option C: Full User System with JWT

More complex but most secure for multiple admins.

## My Recommendation

**For your use case (single admin, private database):**

1. **Host on**: Railway.app or DigitalOcean App Platform
2. **Security**: Add simple password protection (I'll implement this)
3. **Database**: Keep SQLite file (it's perfect for this scale)
4. **Backup**: Set up daily database backups

## Important Environment Variables

You'll need to set these on your hosting platform:

```bash
NODE_ENV=production
PORT=3000
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=random_long_string_here
```

---

## Step-by-Step: Railway Deployment (Recommended for You)

### 1. Prepare Your Code
```bash
# Make sure .gitignore includes the database
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your quredge-landing repo
5. Railway auto-detects Node.js and deploys!

### 3. Add Environment Variables
In Railway dashboard:
- Go to your project → Variables
- Add:
  - `ADMIN_USERNAME` = your_admin_username
  - `ADMIN_PASSWORD` = your_secure_password
  - `SESSION_SECRET` = (generate random string)

### 4. Access Your Site
Railway gives you a URL like: `quredge-landing.up.railway.app`

---

## Database Backup Strategy

### Option 1: Manual Backup
```bash
# Download database file via SFTP/SCP
scp user@your-server:/path/to/quredge-interest.db ./backups/
```

### Option 2: Automated Backup Script
Create a cron job to backup daily (I can provide this).

### Option 3: Railway/Platform Backups
Most platforms offer automatic backups.

---

## Security Checklist

Before going live:
- [ ] Add authentication to admin endpoints ✅ (I'll do this)
- [ ] Set up HTTPS (automatic on Railway/DO)
- [ ] Use environment variables for secrets
- [ ] Add rate limiting
- [ ] Set up database backups
- [ ] Test form submission
- [ ] Test admin access
- [ ] Add monitoring (optional)

---

## Cost Comparison

| Platform | Cost | Ease | Best For |
|----------|------|------|----------|
| Railway | $5/mo | ⭐⭐⭐⭐⭐ | Quick start |
| DigitalOcean App | $5-12/mo | ⭐⭐⭐⭐ | Reliability |
| Render Free | $0 | ⭐⭐⭐⭐ | Testing |
| VPS | $5/mo | ⭐⭐⭐ | Full control |

---

## Next Steps

**I recommend:**
1. Let me add authentication to protect your admin dashboard (next step)
2. Deploy to Railway.app (5 minutes)
3. Set up weekly database backups
4. You're live! 🚀

Would you like me to implement the authentication system now?

