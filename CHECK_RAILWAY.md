# 🔍 How to Check and Fix Your Railway Deployment

## ✅ What I Fixed

**Issue:** Session cookies weren't being saved properly, causing login to fail.

**Solution:** Updated CORS and session configuration in `server.js`:
1. Added `credentials: true` to CORS config
2. Added `sameSite: 'lax'` to cookie config

---

## 🚀 To Redeploy the Fix

### Option 1: Via Railway Dashboard (Easiest) ⭐

1. **Go to your Railway project:**
   - Visit: https://railway.com/project/1e98a6de-b069-44c3-89e7-975299f3ef6a
   - Click on "quredge-webpage" service

2. **Trigger a redeploy:**
   - Click the "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"
   
   OR connect to GitHub and it will auto-deploy on push

---

## 📝 How to Check Environment Variables in Railway

1. **Go to Railway Dashboard:**
   - Visit: https://railway.com/project/1e98a6de-b069-44c3-89e7-975299f3ef6a

2. **Click your service** (quredge-webpage)

3. **Click "Variables" tab**

4. **Verify these are set:**
   ```
   SESSION_SECRET = 9baadf2b498b08a71c53ba6314c47556345ce2ed49d2d0354b5ae9ec93bd0ade
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = [your password]
   NODE_ENV = production
   ```

5. **If any are missing, add them and Railway will auto-redeploy**

---

## 📂 How to See Code in Railway

Railway doesn't show the deployed code directly, but you can:

### Method 1: Check Build Logs
1. Go to your Railway project
2. Click "Deployments" tab
3. Click on a deployment
4. View "Build Logs" and "Deploy Logs"

### Method 2: Check Your Local Code
Your code is in: `/home/mbilkis/quredge-landing/`

The code deployed to Railway is exactly what's in this folder.

### Method 3: Connect to GitHub
1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Railway will auto-deploy on every push
4. You can see code in GitHub

---

## 🐛 Troubleshooting Session Issues

### Check if SESSION_SECRET is Set

**Via Dashboard:**
1. Railway → Your Project → Variables tab
2. Look for `SESSION_SECRET`
3. Should be: `9baadf2b498b08a71c53ba6314c47556345ce2ed49d2d0354b5ae9ec93bd0ade`

**Via CLI (in a real terminal, not Cursor):**
```bash
railway variables
```

### Check Railway Logs

1. Go to Railway dashboard
2. Click your service
3. Click "Deployments" tab
4. Click "View Logs"
5. Look for errors

Common errors:
- `SESSION_SECRET not set` → Add SESSION_SECRET variable
- `Cannot find module` → Dependency issue
- `Port binding` → Usually auto-fixed by Railway

---

## 🔄 To Push New Code to Railway

### If Using Git (Recommended):

1. **Commit your changes:**
```bash
cd /home/mbilkis/quredge-landing
git add server.js
git commit -m "Fix session cookie configuration"
git push
```

2. **Railway auto-deploys** if connected to GitHub

### If Using Railway CLI:

In a **real terminal** (not Cursor), run:
```bash
cd /home/mbilkis/quredge-landing
railway up
```

If it says "multiple services", try:
```bash
railway up --service quredge-webpage
```

---

## 🧪 How to Test if Fix Works

After redeploying:

1. **Clear browser cache and cookies** (important!)
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **Visit login page:**
   ```
   https://quredge-webpage-production.up.railway.app/login.html
   ```

3. **Login with:**
   - Username: `admin`
   - Password: `^#5JQe62A*EJ3je3MYbh` (or your chosen password)

4. **Should redirect to admin dashboard and STAY logged in**

5. **Check browser console** (F12) for errors

---

## 🔐 Verify Session Secret Matches

The session secret should be the same in:
1. ✅ Railway environment variables
2. ✅ Your local `.env` file (if testing locally)

**To verify:**
1. Railway Dashboard → Variables → Check `SESSION_SECRET`
2. Should be: `9baadf2b498b08a71c53ba6314c47556345ce2ed49d2d0354b5ae9ec93bd0ade`

---

## 📊 What Changed in server.js

### Before:
```javascript
app.use(cors());
```

### After:
```javascript
app.use(cors({
  origin: true,
  credentials: true
}));
```

### Before:
```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000
}
```

### After:
```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax' // NEW: Allow cookies on same-site navigation
}
```

---

## ✅ Next Steps

1. **Go to Railway dashboard**: https://railway.com/project/1e98a6de-b069-44c3-89e7-975299f3ef6a
2. **Check Variables tab**: Verify SESSION_SECRET is set
3. **Redeploy**: Click "Redeploy" in Deployments tab
4. **Wait 2 minutes** for deployment to complete
5. **Clear browser cache**
6. **Test login again**: https://quredge-webpage-production.up.railway.app/login.html

---

## 🎯 Your URLs

- **Site**: https://quredge-webpage-production.up.railway.app
- **Login**: https://quredge-webpage-production.up.railway.app/login.html
- **Admin**: https://quredge-webpage-production.up.railway.app/admin.html
- **Railway Dashboard**: https://railway.com/project/1e98a6de-b069-44c3-89e7-975299f3ef6a

---

**The session issue should be fixed after redeploying!** 🚀

