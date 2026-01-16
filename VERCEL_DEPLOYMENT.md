# 🚀 Vercel Deployment Guide - Quredge Landing Page

## ⚠️ IMPORTANT: Vercel Limitations with SQLite

**WARNING**: Vercel's serverless architecture has limitations for SQLite databases:
- Serverless functions are stateless
- File system is read-only (except /tmp which is ephemeral)
- SQLite database will NOT persist between deployments
- Each function invocation may not have access to the same database file

### Recommended Solutions:

#### Option 1: Use Vercel with External Database (RECOMMENDED)
- Use **Vercel Postgres** (managed PostgreSQL)
- Use **PlanetScale** (MySQL)
- Use **MongoDB Atlas** (NoSQL)
- Requires code modifications to switch from SQLite

#### Option 2: Use Alternative Hosting (EASIER for SQLite)
Better platforms for SQLite:
- **Railway.app** ⭐ RECOMMENDED (supports persistent storage)
- **Render.com** (supports persistent disks)
- **DigitalOcean App Platform** (supports persistent volumes)
- **Fly.io** (supports volumes)

---

## If You Still Want to Deploy to Vercel

You have two paths:

### Path A: Quick Deploy (SQLite - Data Will Reset!)
This will work but **ALL DATA WILL BE LOST** on each deployment or restart.

### Path B: Migrate to Vercel Postgres (Recommended)
Vercel offers free PostgreSQL database that persists properly.

---

## 🔐 PRE-DEPLOYMENT SECURITY CHECKLIST

Before deploying to ANY platform, complete these steps:

### ✅ Step 1: Generate New Credentials

#### 1.1 Generate Session Secret
```bash
cd /home/mbilkis/quredge-landing
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - this is your `SESSION_SECRET`

#### 1.2 Create Strong Passwords
Create strong passwords for:
- **Admin Password**: 16+ characters, mixed case, numbers, symbols
- **Viewer Password**: 12+ characters, mixed case, numbers, symbols

Example strong passwords:
- Admin: `Qr$7mK9#nP2wXz5L!aB8`
- Viewer: `V!ew3r#2026$Qur`

### ✅ Step 2: Update Environment Variables

You'll set these in Vercel dashboard (NOT in code):

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=[your_new_secure_admin_password]
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=[your_new_secure_viewer_password]
SESSION_SECRET=[your_generated_session_secret]
NODE_ENV=production
```

**NEVER commit these to Git!**

---

## 📋 DEPLOYMENT STEPS - Path A (Quick Deploy with SQLite)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Command Line
```bash
cd /home/mbilkis/quredge-landing
vercel
```

Follow the prompts:
1. Set up and deploy? **Yes**
2. Which scope? Choose your account
3. Link to existing project? **No**
4. Project name? **quredge-landing** (or your choice)
5. Directory? **./** (current directory)
6. Override settings? **No**

### Step 4: Add Environment Variables

After deployment, go to Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable:

```
ADMIN_USERNAME = admin
ADMIN_PASSWORD = [paste your secure password]
VIEWER_USERNAME = coorganizer
VIEWER_PASSWORD = [paste your viewer password]
SESSION_SECRET = [paste your generated secret]
NODE_ENV = production
```

3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

### Step 5: Redeploy
```bash
vercel --prod
```

Your site will be live at: `https://quredge-landing.vercel.app` (or your custom domain)

### ⚠️ Step 6: Test Everything

1. Visit your site: `https://your-project.vercel.app`
2. Test form submission
3. Test login: `https://your-project.vercel.app/login.html`
4. Test admin dashboard access
5. Test viewer login (read-only access)

---

## 📋 DEPLOYMENT STEPS - Path B (With Vercel Postgres)

This requires code changes but is the proper way for production.

### Step 1: Enable Vercel Postgres

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database**
4. Choose **Postgres**
5. Name it: `quredge-db`
6. Click **Create**

### Step 2: Install Postgres Client

```bash
npm install pg
```

### Step 3: Update Code for Postgres

You'll need to modify `server.js` to use Postgres instead of SQLite.
(I can help with this if you choose this path)

### Step 4: Deploy

Same steps as Path A above.

---

## 🔒 SECURITY BEST PRACTICES

### Before Going Live:

- [ ] ✅ Changed `ADMIN_PASSWORD` from default
- [ ] ✅ Changed `VIEWER_PASSWORD` from default  
- [ ] ✅ Generated new `SESSION_SECRET` (32+ characters)
- [ ] ✅ Set all environment variables in Vercel dashboard
- [ ] ✅ Verified `.gitignore` includes `.env` files
- [ ] ✅ Tested admin login works
- [ ] ✅ Tested viewer login works (read-only)
- [ ] ✅ Tested form submission
- [ ] ✅ HTTPS is enabled (automatic on Vercel)
- [ ] ✅ Tested on mobile devices

### Password Requirements:

**Admin Password:**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not based on "quredge" or "quantum"
- Keep private - never share!

**Viewer Password:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Share only with trusted co-organizers

**Session Secret:**
- 32+ characters (64 recommended)
- Completely random
- Generate with crypto.randomBytes()

---

## 🔄 POST-DEPLOYMENT STEPS

### 1. Set Up Custom Domain (Optional)

In Vercel dashboard:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 2. Set Up Database Backups

**If using Path A (SQLite on Vercel):**
- ⚠️ Data is NOT persistent - not recommended for production

**If using Path B (Vercel Postgres):**
- Vercel automatically backs up Postgres
- Can export data via Vercel dashboard

### 3. Monitor Your Site

- Check Vercel **Analytics** tab
- Monitor form submissions in admin dashboard
- Check for errors in Vercel **Logs**

### 4. Share Viewer Access with Co-Organizers

Send co-organizers this information:

```
Quredge Admin Dashboard (Read-Only Access)

URL: https://quredge-landing.vercel.app/login.html

Username: coorganizer
Password: [your viewer password]

Note: This is read-only access. You can view submissions 
and statistics but cannot modify or export data.
```

**Do NOT share:**
- ❌ Admin username
- ❌ Admin password
- ❌ SESSION_SECRET

---

## 📊 TESTING CHECKLIST

After deployment, test these:

### Public Features:
- [ ] Landing page loads correctly
- [ ] All sections visible and styled properly
- [ ] Forms can be submitted
- [ ] Animations work
- [ ] Mobile responsive
- [ ] All images load

### Authentication:
- [ ] Can login with admin credentials
- [ ] Can login with viewer credentials
- [ ] Admin can access full dashboard
- [ ] Viewer has read-only access
- [ ] Logout works
- [ ] Session persists for 24 hours

### Admin Dashboard (Admin Role):
- [ ] Can view all submissions
- [ ] Can see statistics
- [ ] Can export CSV
- [ ] Can search/filter

### Admin Dashboard (Viewer Role):
- [ ] Can view submissions
- [ ] Can see statistics
- [ ] Cannot export CSV (button hidden)
- [ ] Cannot delete data

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot write to database"
**Solution**: Vercel filesystem is read-only. You need to:
1. Use Vercel Postgres (Path B), OR
2. Deploy to Railway/Render instead

### Issue: "Authentication failed"
**Solution**: Check environment variables in Vercel dashboard
1. Go to Settings → Environment Variables
2. Verify all variables are set correctly
3. Redeploy after changes

### Issue: "Session expired immediately"
**Solution**: Check `SESSION_SECRET` is set
```bash
# Verify in Vercel dashboard
Settings → Environment Variables → SESSION_SECRET
```

### Issue: "Data disappears after deployment"
**Solution**: SQLite doesn't persist on Vercel
- Use Vercel Postgres (recommended), OR
- Deploy to Railway/Render/DigitalOcean

### Issue: "CORS errors"
**Solution**: Already handled in `server.js`, but verify:
```javascript
app.use(cors());
```

---

## 🎯 RECOMMENDED: Deploy to Railway Instead

**Why Railway is better for this project:**

✅ **Persistent SQLite** - Your database file persists
✅ **No code changes needed** - Works out of the box
✅ **Simple deployment** - One command
✅ **Free tier** - $5 credit/month
✅ **Automatic HTTPS** - Built-in SSL

### Quick Railway Deploy:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Add environment variables
railway variables set ADMIN_PASSWORD=your_secure_password
railway variables set VIEWER_PASSWORD=your_viewer_password
railway variables set SESSION_SECRET=your_session_secret

# Get your URL
railway domain
```

See `DEPLOY_RAILWAY.md` for detailed Railway instructions.

---

## 📝 QUICK REFERENCE

### Essential URLs (Vercel):
- **Landing Page**: `https://your-project.vercel.app`
- **Login**: `https://your-project.vercel.app/login.html`
- **Admin Dashboard**: `https://your-project.vercel.app/admin.html`

### Essential Commands:
```bash
# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME
```

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Project Issues**: Check Vercel dashboard → Logs

---

## ✅ FINAL CHECKLIST BEFORE GOING LIVE

Print this and check off each item:

### Security:
- [ ] Changed admin password from default
- [ ] Changed viewer password from default
- [ ] Generated new SESSION_SECRET
- [ ] All secrets set in Vercel (not in code)
- [ ] `.env` in `.gitignore`

### Functionality:
- [ ] Landing page works
- [ ] Form submission works
- [ ] Admin login works
- [ ] Viewer login works
- [ ] Admin has full access
- [ ] Viewer has read-only access
- [ ] Logout works
- [ ] Mobile responsive

### Performance:
- [ ] All tests passing (`npm test`)
- [ ] No console errors
- [ ] Fast page load
- [ ] Images optimized

### Documentation:
- [ ] Viewer credentials shared with co-organizers
- [ ] Admin credentials kept private
- [ ] Backup plan in place
- [ ] Monitoring set up

---

**Ready to deploy? Follow the checklist above! 🚀**

**My Recommendation: Use Railway instead of Vercel for easier SQLite support.**

