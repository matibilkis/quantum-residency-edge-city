# Environment Variables Setup

## Creating Your .env File

The `.env` file stores your secure credentials. **Never commit this file to Git!**

### Step 1: Copy the Example File

```bash
cp .env.example .env
```

### Step 2: Edit the .env File

Open `.env` in your text editor and update the values:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Admin Authentication
# CHANGE THESE BEFORE DEPLOYING!
ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD=your_secure_password_here

# Session Secret
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=paste_generated_secret_here

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Generate a Secure Session Secret

Run this command to generate a random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET` value.

### Step 4: Choose a Strong Password

Your admin password should be:
- At least 12 characters long
- Include uppercase and lowercase letters
- Include numbers
- Include special characters
- Not related to "quredge" or common words

**Good examples:**
- `Qr7$mK9#nP2wXz5L`
- `T!gh3r_Qu@ntum92`
- `Edge#City$2026!Qr`

**Bad examples:**
- `password123`
- `quredge2026`
- `admin`

## For Different Environments

### Local Development

```bash
NODE_ENV=development
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=local_test_password
SESSION_SECRET=generated_random_string
```

### Production (Railway, DigitalOcean, etc.)

Set these as environment variables in your hosting platform dashboard:

```bash
NODE_ENV=production
PORT=3000  # Usually auto-assigned by platform
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_very_secure_password
SESSION_SECRET=very_long_random_string_32plus_chars
```

## Security Best Practices

### ✅ DO:
- Use different passwords for different environments
- Generate a new SESSION_SECRET for each environment
- Keep `.env` file in `.gitignore`
- Use strong, unique passwords
- Regularly update your credentials
- Back up your `.env` file securely (encrypted backup)

### ❌ DON'T:
- Commit `.env` to Git
- Share your `.env` file
- Use the default password in production
- Use the same password across environments
- Store passwords in plaintext anywhere else

## Verifying Your Setup

### Check if .env is Loaded

Start your server and check the console:

```bash
npm start
```

You should see:
- ✅ No warning about default password (if you changed it)
- ✅ Server starts successfully
- ✅ You can login with your credentials

If you see:
- ⚠️ "Using default admin password" - You need to set `ADMIN_PASSWORD`

### Test Your Credentials

1. Start the server: `npm start`
2. Visit: http://localhost:3000/login.html
3. Login with your credentials from `.env`
4. If successful, you'll be redirected to admin dashboard

## Troubleshooting

### "Cannot find module 'dotenv'"

The current setup doesn't use dotenv package (credentials are read directly from `process.env`). 

To use `.env` file automatically, you have two options:

**Option 1: Use node command prefix**
```bash
# On Linux/Mac
export $(cat .env | xargs) && npm start

# On Windows
# Manually set each variable or use cross-env package
```

**Option 2: Install dotenv**
```bash
npm install dotenv
```

Then add to the top of `server.js`:
```javascript
require('dotenv').config();
```

### "Still using default password"

Make sure your `.env` file:
- Is in the project root directory
- Is named exactly `.env` (not `.env.txt`)
- Has proper syntax (no quotes needed for values)
- Is being loaded (see Option 1 or 2 above)

### Can't Login

1. Check your `.env` file for typos
2. Restart the server after changing `.env`
3. Try the default credentials: `admin` / `quredge2026`
4. Check server logs for authentication errors

## For Hosting Platforms

Most platforms have a UI for setting environment variables. Don't use a `.env` file on production - set variables directly in the platform:

### Railway
1. Go to project dashboard
2. Click "Variables" tab
3. Add each variable with "New Variable" button

### DigitalOcean App Platform
1. Go to app settings
2. Click "App-Level Environment Variables"
3. Add each variable

### Heroku
1. Go to app settings
2. Click "Reveal Config Vars"
3. Add each variable as a config var

### Render
1. Go to dashboard
2. Click "Environment"
3. Add each variable

## Example Complete .env File

```bash
# Quredge Landing - Environment Variables
# Created: 2026-01-15

# Server
PORT=3000
NODE_ENV=development

# Authentication (CHANGE THESE!)
ADMIN_USERNAME=quredge_admin
ADMIN_PASSWORD=MySecure#Pass2026!Quantum
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Notes:
# - Never commit this file
# - Generate new SESSION_SECRET with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# - Use different credentials for production
```

## Next Steps

After setting up your `.env`:

1. ✅ Test login locally
2. ✅ Verify admin dashboard access
3. ✅ Test form submission
4. ✅ Back up your `.env` securely
5. ✅ Set up production environment variables
6. ✅ Deploy!

---

**Remember**: Your `.env` file contains sensitive data. Treat it like a password!

