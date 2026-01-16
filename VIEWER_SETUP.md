# Read-Only Viewer Setup for Co-Organizers

## Overview

You can now give co-organizers **read-only access** to view submissions without letting them modify or delete data.

## Two User Roles

### 1. Admin (You)
- **Full access**: View, export, manage everything
- **Username**: Set in `ADMIN_USERNAME`
- **Password**: Set in `ADMIN_PASSWORD`

### 2. Viewer (Co-Organizers)
- **Read-only access**: Can view submissions and stats
- **Cannot**: Delete, modify, or export data
- **Username**: Set in `VIEWER_USERNAME`
- **Password**: Set in `VIEWER_PASSWORD`

## Setup Instructions

### Step 1: Add Viewer Credentials to .env

Edit your `.env` file and add:

```bash
# Admin Credentials (full access - that's you!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# Viewer Credentials (read-only for co-organizers)
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=viewer_secure_password_here
```

**Tips:**
- Use a different username than "viewer" (e.g., "coorganizer", "team", etc.)
- Use a strong but shareable password
- Share viewer credentials only with trusted co-organizers

### Step 2: Update server.js to use new auth

Replace this line in `server.js`:
```javascript
const auth = require('./auth');
```

With:
```javascript
const auth = require('./auth-roles');
```
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=viewer_secure_password_here
### Step 3: Restart Server

```bash
# Stop current server (Ctrl+C)
npm start
```

### Step 4: Test Both Accounts

**Test Admin:**
1. Go to http://localhost:3000/login.html
2. Login with admin credentials
3. Should see full dashboard with export button

**Test Viewer:**
1. Logout
2. Login with viewer credentials
3. Should see dashboard but read-only

### Step 5: Deploy to Railway

In Railway dashboard, add these environment variables:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=viewer_password_here
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

## Sharing with Co-Organizers

### What to Share

Send co-organizers:
```
Quredge Admin Dashboard (Read-Only Access)

URL: https://your-project.up.railway.app/login.html

Username: coorganizer
Password: [viewer password]

Note: This is read-only access. You can view submissions 
and statistics but cannot modify or export data.
```

### What NOT to Share

❌ Never share your admin credentials
❌ Never share the admin password
❌ Never share the SESSION_SECRET

## Permissions Comparison

| Action | Admin | Viewer |
|--------|-------|--------|
| View submissions | ✅ Yes | ✅ Yes |
| View statistics | ✅ Yes | ✅ Yes |
| Search submissions | ✅ Yes | ✅ Yes |
| Export CSV | ✅ Yes | ❌ No |
| Delete submissions | ✅ Yes | ❌ No |
| Modify data | ✅ Yes | ❌ No |

## Security Best Practices

### For Admin Password
- Use 16+ characters
- Mix uppercase, lowercase, numbers, symbols
- Don't share with anyone
- Change every 3-6 months

### For Viewer Password
- Use 12+ characters
- Strong but memorable for team
- Share only with trusted co-organizers
- Change if someone leaves the team

### Rotating Viewer Password

When someone leaves the team:

1. Change `VIEWER_PASSWORD` in `.env`
2. Update on Railway
3. Restart server
4. Share new password with remaining team

## Troubleshooting

### Viewer Can't Login

Check:
1. `VIEWER_USERNAME` and `VIEWER_PASSWORD` set in `.env`
2. Server restarted after changes
3. Credentials match exactly (case-sensitive)

### Viewer Sees "Admin Required" Error

This is correct! Viewer role cannot:
- Export CSV
- Delete data
- Modify submissions

### Want to Add More Viewers

Currently supports one viewer account. To add more:
- Share the same viewer credentials with multiple people
- Or modify `auth-roles.js` to support multiple viewer accounts

## Example .env File

```bash
# Server
PORT=3000
NODE_ENV=development

# Admin (Full Access)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=MySecure#Admin2026!

# Viewer (Read-Only)
VIEWER_USERNAME=coorganizer
VIEWER_PASSWORD=Team#View2026

# Session
SESSION_SECRET=your_random_32char_secret_here
```

## Upgrading from Single-User Auth

If you're upgrading from the old `auth.js`:

1. Create `auth-roles.js` (already done)
2. Add viewer credentials to `.env`
3. Change `server.js` to use `auth-roles`
4. Restart server
5. Test both accounts

Your existing admin credentials will continue to work!

## Quick Reference

```bash
# Admin login
Username: admin (or your ADMIN_USERNAME)
Password: [your admin password]
Access: Full

# Viewer login
Username: viewer (or your VIEWER_USERNAME)
Password: [your viewer password]
Access: Read-only
```

---

**Remember**: Admin password = private, Viewer password = shareable with team!

