# Security Checklist - Before Pushing to GitHub

## ✅ Already Protected

Your setup already has these protections:

1. **`.env` file is gitignored** ✅
   - Real credentials won't be committed
   - Only `.env.example` (with fake credentials) is committed

2. **Test credentials are safe** ✅
   - Only used in automated tests
   - Not your real admin password

3. **Database is gitignored** ✅
   - `*.db` files won't be committed
   - User data stays private

## 🔒 Before First Push to GitHub

### Step 1: Verify .env is NOT tracked

```bash
# Check what will be committed
git status

# Should NOT see .env in the list
# If you see .env, run:
git rm --cached .env
```

### Step 2: Double-check .gitignore

```bash
cat .gitignore | grep .env
```

Should show:
```
.env
.env.local
.env.production
```

### Step 3: Initialize Git (if not done)

```bash
# Initialize repository
git init

# Add all files (except those in .gitignore)
git add .

# Verify .env is NOT staged
git status

# Should NOT see .env in "Changes to be committed"
```

### Step 4: Commit Safely

```bash
# Commit (without .env)
git commit -m "Initial commit - credentials protected"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/quredge-landing.git

# Push
git push -u origin main
```

## 🚨 If You Accidentally Committed .env

**Don't panic!** Here's how to fix it:

### Option 1: Remove from Last Commit (if not pushed yet)

```bash
# Remove .env from staging
git rm --cached .env

# Amend the commit
git commit --amend

# Now push
git push
```

### Option 2: If Already Pushed to GitHub

```bash
# Remove from git history
git rm --cached .env
git commit -m "Remove .env from tracking"
git push

# IMPORTANT: Change your credentials immediately!
# The old password is now in git history
```

Then:
1. Change `ADMIN_PASSWORD` in your `.env`
2. Change `SESSION_SECRET` in your `.env`
3. Update credentials on Railway

## 🔐 Setting Credentials on Railway

When deploying, set these as **Environment Variables** in Railway dashboard:

```
ADMIN_USERNAME=your_real_username
ADMIN_PASSWORD=your_real_secure_password
SESSION_SECRET=your_real_session_secret
NODE_ENV=production
```

**Never put real credentials in code!**

## ✅ Verification Checklist

Before every push:

- [ ] Run `git status` - .env should NOT appear
- [ ] Check `.gitignore` includes `.env`
- [ ] Real credentials only in `.env` (not in code)
- [ ] `.env.example` has fake/placeholder values only
- [ ] Database files (*.db) not tracked
- [ ] Test credentials are different from production

## 🔍 Check What Will Be Committed

```bash
# See all files that will be committed
git add .
git status

# See exact file contents that will be committed
git diff --cached

# If you see .env or real credentials, STOP and remove them
```

## 📝 Safe Files to Commit

✅ **Safe to commit:**
- `.env.example` (template with fake values)
- `.gitignore` (protects .env)
- `server.js` (no hardcoded credentials)
- `auth.js` (no hardcoded credentials)
- All other code files

❌ **NEVER commit:**
- `.env` (real credentials)
- `*.db` (user data)
- `coverage/` (test reports)
- `node_modules/` (dependencies)

## 🛡️ Additional Security

### Use Strong Passwords

```bash
# Generate secure password (32 characters)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Rotate Credentials Regularly

Every 3-6 months:
1. Generate new `ADMIN_PASSWORD`
2. Generate new `SESSION_SECRET`
3. Update in `.env` and Railway

### Monitor GitHub

If you ever accidentally commit credentials:
1. Change them IMMEDIATELY
2. Remove from git history
3. Force push to GitHub

## 🎯 Summary

**Your credentials are safe if:**
- ✅ `.env` is in `.gitignore`
- ✅ `git status` doesn't show `.env`
- ✅ Real credentials only in `.env` and Railway
- ✅ Code uses `process.env.ADMIN_PASSWORD` (not hardcoded)

**You're already set up correctly!** Just make sure to:
1. Never remove `.env` from `.gitignore`
2. Check `git status` before pushing
3. Keep real credentials in `.env` and Railway only

