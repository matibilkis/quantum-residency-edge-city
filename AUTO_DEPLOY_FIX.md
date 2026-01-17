# 🔄 Fix Railway Auto-Deploy

## Problem
You have to manually click "Check for updates" after every git push. This should be automatic!

---

## ✅ Solution: Enable Auto-Deploy

### **Method 1: Reconnect GitHub (Easiest)** ⭐

1. **Railway Dashboard** → Your service → **Settings** tab

2. **In "Source Repo" section:**
   - Click **"Disconnect"** (next to your GitHub repo)
   - Confirm disconnection

3. **Reconnect:**
   - Click **"Connect Repo"** or **"+ Source"**
   - **Select GitHub**
   - **Authorize Railway** (grant all permissions!)
   - **Select repo:** `matibilkis/quantum-residency-edge-city`
   - **Select branch:** `main`

4. **Look for Auto-Deploy Setting:**
   - After connecting, you might see a toggle for:
     - "Auto-deploy on push" ✅
     - "Deploy on commit" ✅
     - "Continuous deployment" ✅
   - **Make sure it's ENABLED**

5. **Save/Confirm**

---

### **Method 2: Verify GitHub Webhook**

Your GitHub webhook might not be configured correctly.

1. **Go to GitHub:**
   - Repository: https://github.com/matibilkis/quantum-residency-edge-city
   - **Settings** → **Webhooks**

2. **Find Railway Webhook:**
   - Should see a webhook with Railway URL
   - URL format: `https://backboard.railway.app/...` or similar

3. **Click on the webhook** and check:
   - ✅ **Active** (green checkmark at top)
   - ✅ **Content type:** `application/json`
   - ✅ **Events:** At minimum "Just the push event" or "Pushes"
   - ✅ **SSL verification:** Enabled

4. **Check Recent Deliveries:**
   - Scroll down to "Recent Deliveries"
   - Should show green checkmarks ✅ (successful)
   - If red ❌ (failed), click to see error

5. **If webhook is missing or broken:**
   - Delete it
   - Go back to Railway and disconnect/reconnect GitHub

---

### **Method 3: Railway Settings Deep Dive**

Sometimes the auto-deploy setting is hidden deeper in Railway's UI.

**In Railway Settings tab:**

1. **Scroll ALL the way down**
2. Look for these sections (they might be collapsed):
   - **"Service Settings"**
   - **"Build Settings"**
   - **"Deploy Settings"**
   - **"Watch Paths"**
   - **"Production Branch"**

3. **In any of these sections, look for:**
   - Auto-deploy toggle
   - Deploy triggers
   - Branch configuration
   - Webhook settings

4. **Make sure:**
   - Production branch = `main` ✅
   - Auto-deploy = ON ✅
   - Watch paths = (empty or `**/*` to watch all files)

---

## 🧪 Test Auto-Deploy

After enabling auto-deploy:

### **Test 1: Make a Small Change**

```bash
cd /home/mbilkis/quredge-landing
echo "# Auto-deploy test $(date)" >> .test-deploy
git add .test-deploy
git commit -m "Test auto-deploy $(date +%s)"
git push origin main
```

### **Test 2: Watch Railway**

1. **Immediately go to Railway** → **Deployments** tab
2. **Wait 15-30 seconds**
3. **You should see:** A new deployment automatically start
4. **Commit message** should match your test commit

**If deployment starts automatically:** ✅ Auto-deploy is working!
**If nothing happens after 2 minutes:** ⚠️ Auto-deploy still not enabled

---

## 🔍 Why "Check for Updates" Button Exists

The "Check for updates" button is Railway's **manual trigger** for when:
- Auto-deploy is disabled (current situation)
- You want to force-deploy without a new commit
- Webhook failed but you want to deploy anyway

**Once auto-deploy is enabled, you won't need this button anymore!**

---

## 📋 What Auto-Deploy Does

**Before (manual):**
```
1. You: git push
2. GitHub: Receives code
3. Railway: Does nothing
4. You: Go to Railway → Click "Check for updates"
5. Railway: Checks GitHub → Deploys
```

**After (automatic):**
```
1. You: git push
2. GitHub: Receives code → Sends webhook to Railway
3. Railway: Automatically starts deployment
4. You: Nothing! Just watch it deploy
```

---

## 🎯 Current Status

Your setup:
- ✅ Railway connected to GitHub repo
- ✅ Branch: `main`
- ⚠️ **Auto-deploy: NOT enabled** (hence the "Check for updates" button)

**Fix:** Disconnect and reconnect GitHub in Railway with proper permissions!

---

## 🔐 Required GitHub Permissions

When reconnecting, Railway needs these permissions:
- ✅ Read repository contents
- ✅ Read repository metadata
- ✅ Create/manage webhooks
- ✅ Write commit statuses (for deployment status)

**Grant all permissions when Railway asks!**

---

## 🛟 If Nothing Works

If auto-deploy still doesn't work after trying everything:

### **Option A: Accept Manual Updates**
- It's not ideal, but clicking "Check for updates" does work
- Just remember to do it after each push

### **Option B: Use Railway CLI**
Instead of pushing and clicking "Check for updates":
```bash
git push origin main && railway up
```

This pushes to GitHub AND deploys to Railway in one command.

### **Option C: GitHub Actions (Advanced)**
Set up GitHub Actions to trigger Railway deployments via API.

---

## ✅ Expected Behavior After Fix

**Every time you:**
```bash
git commit -m "Update something"
git push origin main
```

**Railway automatically:**
1. Detects the push via webhook (within 5-10 seconds)
2. Starts a new deployment
3. Builds your code
4. Deploys to production
5. You get the updated site (2-3 minutes total)

**No clicking required!** 🎉

---

## 🎯 Action Plan

1. **Try Method 1:** Disconnect/reconnect GitHub (5 minutes)
2. **Test:** Push a small change
3. **Verify:** Check Railway Deployments tab for automatic deployment
4. **If works:** ✅ Done! No more manual clicks
5. **If doesn't work:** Check Method 2 (GitHub webhook)

---

**Start with Method 1 - disconnect and reconnect GitHub with full permissions!**

