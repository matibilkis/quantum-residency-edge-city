# Answers to Your Questions

## 1. What is `npm run test:watch`?

**Test Watch Mode** - Automatically re-runs tests when files change!

### How it works:
```bash
npm run test:watch
```

- Tests run immediately
- Watches your files for changes
- When you save a file → tests automatically re-run
- Perfect for development workflow

### Example Usage:
```bash
# Terminal 1: Start watch mode
npm run test:watch

# Terminal 2: Edit code
# Make changes to server.js
# Save file
# → Tests automatically run in Terminal 1!
```

### When to use:
- ✅ During development
- ✅ When writing new features
- ✅ When fixing bugs
- ✅ To get instant feedback

### When NOT to use:
- ❌ Before deploying (use `npm test` instead)
- ❌ In CI/CD pipelines
- ❌ When you want a single test run

---

## 2. Keeping Admin Credentials Secret on GitHub

### ✅ Already Protected!

Your setup is already secure! Here's what's in place:

1. **`.env` is in `.gitignore`** ✅
   - Your real credentials won't be committed
   - File: `.gitignore` line 16: `.env`

2. **`.env.example` has fake credentials** ✅
   - Only template is committed to GitHub
   - Contains placeholder values, not real passwords

3. **Database is gitignored** ✅
   - `*.db` files won't be committed
   - User data stays private

### What You Should Do Before Pushing to GitHub:

#### Step 1: Verify .env is NOT tracked

```bash
# Check what will be committed
git status

# Should NOT see .env in the list
```

If you see `.env`:
```bash
git rm --cached .env
```

#### Step 2: Initialize Git (if not done)

```bash
# Initialize repository
git init

# Add all files (except those in .gitignore)
git add .

# Verify .env is NOT staged
git status
```

#### Step 3: Commit Safely

```bash
# Commit (without .env)
git commit -m "Initial commit - credentials protected"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/quredge-landing.git

# Push
git push -u origin main
```

### 🚨 If You Accidentally Committed .env

**Don't panic!** Fix it:

```bash
# Remove .env from git tracking
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from tracking"

# Push
git push

# IMPORTANT: Change your passwords immediately!
# The old password is now in git history
```

### Setting Credentials on Railway (Production)

In Railway dashboard → Variables, set:

```
ADMIN_USERNAME=your_real_username
ADMIN_PASSWORD=your_real_secure_password
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=viewer_password
SESSION_SECRET=your_random_secret
NODE_ENV=production
```

**Never put real credentials in code!**

### Security Checklist

Before every push:

- [ ] Run `git status` - .env should NOT appear
- [ ] Check `.gitignore` includes `.env`
- [ ] Real credentials only in `.env` and Railway
- [ ] `.env.example` has fake values only
- [ ] Database files (*.db) not tracked

**See `SECURITY_CHECKLIST.md` for complete guide!**

---

## 3. Creating Read-Only Viewer for Co-Organizers

### ✅ Already Implemented!

I've created a two-role system:

### Two User Roles:

**1. Admin (You)**
- Full access: View, export, manage everything
- Username: Set in `ADMIN_USERNAME`
- Password: Set in `ADMIN_PASSWORD`

**2. Viewer (Co-Organizers)**
- Read-only access: View submissions and stats
- Cannot: Delete, modify, or export data
- Username: Set in `VIEWER_USERNAME`
- Password: Set in `VIEWER_PASSWORD`

### Setup Instructions:

#### Step 1: Add to your .env file

```bash
# Admin Credentials (full access - that's you!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# Viewer Credentials (read-only for co-organizers)
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=viewer_secure_password_here
```

#### Step 2: Update server.js

Replace this line:
```javascript
const auth = require('./auth');
```

With:
```javascript
const auth = require('./auth-roles');
```

#### Step 3: Restart server

```bash
npm start
```

#### Step 4: Test both accounts

**Test Admin:**
- Login with admin credentials
- Should see full dashboard with export button

**Test Viewer:**
- Login with viewer credentials
- Should see dashboard but read-only

### Sharing with Co-Organizers

Send them:
```
Quredge Admin Dashboard (Read-Only Access)

URL: https://your-project.up.railway.app/login.html

Username: coorganizer
Password: [viewer password]

Note: This is read-only access. You can view submissions 
and statistics but cannot modify or export data.
```

### Permissions Comparison

| Action | Admin | Viewer |
|--------|-------|--------|
| View submissions | ✅ Yes | ✅ Yes |
| View statistics | ✅ Yes | ✅ Yes |
| Search submissions | ✅ Yes | ✅ Yes |
| Export CSV | ✅ Yes | ❌ No |
| Delete submissions | ✅ Yes | ❌ No |
| Modify data | ✅ Yes | ❌ No |

**See `VIEWER_SETUP.md` for complete guide!**

---

## 4. Smaller Card Expansion (Fixed!)

### ✅ Redesigned!

I've completely redesigned the card expansion:

### Old Design (Modal):
- ❌ Big overlay that covered everything
- ❌ Required scrolling inside modal
- ❌ Lost context of other cards

### New Design (Expandable Cards):
- ✅ Cards expand vertically in place
- ✅ Other cards stay visible
- ✅ Scroll inside each card
- ✅ No need to scroll the whole page
- ✅ Click outside or ESC to close

### How It Works:

**Before clicking "Learn More":**
- Shows first 2 paragraphs
- Card is compact
- All 3 cards visible

**After clicking "Learn More":**
- Card expands vertically
- Shows full content
- Scrollable inside the card
- Other cards still visible
- Button changes to "Show Less"

### Features:

✅ **Smooth Animation**
- Cards expand/collapse smoothly
- Content fades in nicely

✅ **Scrollable Content**
- Scroll inside expanded card
- Custom scrollbar styling
- Max height prevents page overflow

✅ **Easy to Close**
- Click "Show Less" button
- Click outside the card
- Press ESC key

✅ **Mobile Friendly**
- Works great on all screen sizes
- Touch-friendly scrolling

### Files Created:

- `css/cards-expandable.css` - Expansion styling
- `js/expandable-cards.js` - Expansion logic

### Test It:

```bash
# Refresh your browser
# Hard refresh: Ctrl+Shift+R

# Click "Learn More" on any card
# Card expands vertically
# Scroll inside the card
# Other cards stay visible!
```

---

## Summary

### 1. Test Watch Mode
```bash
npm run test:watch  # Auto-runs tests on file save
```

### 2. GitHub Security
- ✅ `.env` already in `.gitignore`
- ✅ Check `git status` before pushing
- ✅ See `SECURITY_CHECKLIST.md`

### 3. Viewer Role
- ✅ Read-only access for co-organizers
- ✅ See `VIEWER_SETUP.md`
- ✅ Update `server.js` to use `auth-roles`

### 4. Card Expansion
- ✅ Cards now expand vertically
- ✅ No more big modal
- ✅ Scroll inside cards
- ✅ Other cards stay visible

---

## Next Steps

1. **Test the new card design:**
   ```bash
   # Refresh browser (Ctrl+Shift+R)
   # Click "Learn More" on cards
   ```

2. **Set up viewer role:**
   ```bash
   # Edit .env to add viewer credentials
   # Update server.js to use auth-roles
   # Restart server
   ```

3. **Before pushing to GitHub:**
   ```bash
   # Verify .env is not tracked
   git status
   # Should NOT see .env
   ```

4. **Deploy to Railway:**
   ```bash
   # Set all environment variables
   # Including VIEWER_USERNAME and VIEWER_PASSWORD
   ```

All done! 🎉

