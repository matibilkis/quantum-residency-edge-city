# Update Credentials Guide

## ⚠️ MUST DO Before Deploying to Production!

**Why:** Default credentials are in documentation and visible to anyone. Using them in production is a major security risk!

## Current Default Credentials (INSECURE for Production)

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=quredge2026
VIEWER_USERNAME=viewer
VIEWER_PASSWORD=viewer2026
```

**These are ONLY for local testing!**

---

## Step-by-Step: Update Credentials

### Step 1: Generate Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
7f8e9d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e
```

Copy this! You'll need it.

### Step 2: Edit Your .env File

```bash
# Open .env file
nano .env

# Or use your preferred editor
code .env
```

### Step 3: Replace with YOUR Credentials

**Delete the current test credentials and add:**

```bash
# Quredge Landing - Production Environment

PORT=3000
NODE_ENV=development

# Admin Credentials (Full Access - Keep This Private!)
ADMIN_USERNAME=your_admin_name
ADMIN_PASSWORD=Your#Secure!Password2026

# Viewer Credentials (Read-Only for Co-Organizers)
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=Team#Secure!Password2026

# Session Secret (Paste the generated one from Step 1)
SESSION_SECRET=paste_the_long_hex_string_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Save and Restart Server

```bash
# Save the .env file
# Then restart your server

npm start
```

### Step 5: Test Your New Credentials

```bash
# Visit http://localhost:3000/login.html
# Login with your NEW admin credentials
# Should work!
```

---

## Password Guidelines

### Admin Password (Your Personal Access)

**Requirements:**
- ✅ At least 16 characters
- ✅ Uppercase letters (A-Z)
- ✅ Lowercase letters (a-z)
- ✅ Numbers (0-9)
- ✅ Special characters (!@#$%^&*)

**Good Examples:**
- `MyAdmin#Quredge2026!Secure`
- `Quantum$Admin!2026Edge`
- `Qr!Adm1n#Edge$2026`

**Bad Examples:**
- ❌ `password123`
- ❌ `quredge2026`
- ❌ `admin`
- ❌ Anything in this documentation!

### Viewer Password (For Co-Organizers)

**Requirements:**
- ✅ At least 12 characters
- ✅ Strong but somewhat memorable
- ✅ Different from admin password

**Good Examples:**
- `TeamView#2026Quantum!`
- `CoOrg!Quredge$2026`
- `Edge#Team!View2026`

---

## Deploying to Railway

### Option 1: Set Environment Variables in Railway Dashboard

1. Go to Railway dashboard
2. Select your project
3. Click "Variables" tab
4. Add each variable:

```
ADMIN_USERNAME = your_admin_name
ADMIN_PASSWORD = Your#Secure!Password2026
VIEWER_USERNAME = coorganizer
VIEWER_PASSWORD = Team#Secure!Password2026
SESSION_SECRET = paste_your_generated_secret_here
NODE_ENV = production
```

5. Click "Deploy" or restart service

### Option 2: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set variables
railway variables set ADMIN_USERNAME=your_admin_name
railway variables set ADMIN_PASSWORD="Your#Secure!Password2026"
railway variables set VIEWER_USERNAME=coorganizer
railway variables set VIEWER_PASSWORD="Team#Secure!Password2026"
railway variables set SESSION_SECRET="your_generated_secret"
railway variables set NODE_ENV=production
```

---

## Verification Checklist

Before deploying:

- [ ] Generated new SESSION_SECRET
- [ ] Changed ADMIN_PASSWORD to strong, unique password
- [ ] Changed VIEWER_PASSWORD to different password
- [ ] Updated .env file locally
- [ ] Tested login locally with new credentials
- [ ] Set all variables in Railway
- [ ] .env file is in .gitignore (already done)
- [ ] Never committed real credentials to GitHub

---

## Security Best Practices

### ✅ DO:
- Use different passwords for admin and viewer
- Use different passwords for local and production
- Store passwords in password manager
- Change passwords every 3-6 months
- Use SESSION_SECRET with at least 32 random characters

### ❌ DON'T:
- Use default passwords in production
- Share admin password with anyone
- Commit .env to GitHub
- Use same password across different systems
- Use simple or predictable passwords

---

## What If I Already Deployed with Default Credentials?

**Fix it immediately:**

1. **Change credentials in Railway:**
   - Dashboard → Variables
   - Update ADMIN_PASSWORD
   - Update VIEWER_PASSWORD
   - Update SESSION_SECRET
   - Restart service

2. **Verify it worked:**
   - Try logging in with old password (should fail)
   - Try logging in with new password (should work)

3. **Monitor for suspicious activity:**
   - Check admin dashboard for unexpected submissions
   - Review login attempts if you add logging

---

## Common Questions

### Q: Can I use the same username but different password?

**A:** Yes! You can keep `ADMIN_USERNAME=admin` if you want, just make sure to change the password.

### Q: Do I need to change usernames too?

**A:** It's more secure to change them, but the critical part is the PASSWORDS. At minimum:
- ✅ Must change: ADMIN_PASSWORD, VIEWER_PASSWORD, SESSION_SECRET
- ⭐ Should change: ADMIN_USERNAME, VIEWER_USERNAME (but not critical)

### Q: What if I forget my password?

**For local development:**
- Edit `.env` file
- Set new password
- Restart server

**For Railway:**
- Go to Railway dashboard
- Variables → Update ADMIN_PASSWORD
- Restart service
- Login with new password

### Q: Can I share viewer password with my team?

**A:** Yes! That's the point of the viewer account. But:
- Only share with trusted co-organizers
- Change it if someone leaves the team
- Never share the ADMIN password

---

## Quick Commands

```bash
# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Edit .env file
nano .env

# Restart server
npm start

# Verify .env is not tracked by git
git status  # Should NOT see .env

# Set Railway variables (after installing Railway CLI)
railway variables set ADMIN_PASSWORD="YourPassword"
```

---

## Summary

**Before deploying to production:**

1. ✅ Generate new SESSION_SECRET
2. ✅ Set strong ADMIN_PASSWORD
3. ✅ Set strong VIEWER_PASSWORD  
4. ✅ Update .env locally
5. ✅ Test locally
6. ✅ Set variables in Railway
7. ✅ Deploy!

**Remember:** Default credentials are PUBLIC in documentation. Never use them in production!

---

**Need help?** See `SECURITY_CHECKLIST.md` for more security guidelines.

