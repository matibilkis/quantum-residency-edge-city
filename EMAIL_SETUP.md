# 📧 Email Notifications Setup Guide

Get instant email alerts when someone submits the interest form!

---

## 🎯 How It Works

When someone fills out your interest form, you'll automatically receive an email with:
- ✅ Participant's name and email
- ✅ What they're curious about
- ✅ Participation type (Attendant/Sponsor/Both)
- ✅ Institution (if provided)
- ✅ Direct link to admin dashboard

---

## ⚙️ Setup Options

Choose one of these email services:

### Option 1: Gmail (Easiest for Personal Use) ⭐

### Option 2: SendGrid (Best for Production)

### Option 3: Custom SMTP Server

---

## 📋 Option 1: Gmail Setup (Recommended for Testing)

### Step 1: Create App Password

1. **Go to your Google Account:** https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not already)
3. **Security** → **App passwords**
4. **Select app:** Mail
5. **Select device:** Other (Custom name) → "Quredge Landing"
6. **Copy the 16-character password** (you'll need this!)

### Step 2: Add Environment Variables to Railway

In Railway Dashboard → Variables tab, add:

```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = your.email@gmail.com
EMAIL_PASSWORD = your-16-char-app-password
NOTIFICATION_EMAIL = your.email@gmail.com
```

**Replace:**
- `your.email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the app password from Step 1

### Step 3: Deploy

Railway will auto-redeploy with email enabled! ✅

---

## 📋 Option 2: SendGrid Setup (Best for Production)

SendGrid is free for up to 100 emails/day.

### Step 1: Create SendGrid Account

1. Go to: https://sendgrid.com/
2. Sign up for free account
3. Verify your email address
4. **Create API Key:**
   - Settings → API Keys
   - Create API Key
   - Choose "Full Access"
   - Copy the API key (starts with `SG.`)

### Step 2: Verify Sender Email

1. Settings → Sender Authentication
2. Verify a Single Sender
3. Enter your email and details
4. Verify via email link

### Step 3: Add Environment Variables to Railway

```
EMAIL_HOST = smtp.sendgrid.net
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = apikey
EMAIL_PASSWORD = your-sendgrid-api-key
NOTIFICATION_EMAIL = verified-email@yourdomain.com
```

**Replace:**
- `your-sendgrid-api-key` with your SendGrid API key
- `verified-email@yourdomain.com` with the email you verified in Step 2

---

## 📋 Option 3: Custom SMTP (Any Email Provider)

### Common SMTP Settings:

#### Outlook/Hotmail:
```
EMAIL_HOST = smtp-mail.outlook.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = your-email@outlook.com
EMAIL_PASSWORD = your-password
NOTIFICATION_EMAIL = your-email@outlook.com
```

#### Yahoo:
```
EMAIL_HOST = smtp.mail.yahoo.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = your-email@yahoo.com
EMAIL_PASSWORD = your-app-password
NOTIFICATION_EMAIL = your-email@yahoo.com
```

#### Custom Domain (cPanel/etc):
```
EMAIL_HOST = mail.yourdomain.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = notifications@yourdomain.com
EMAIL_PASSWORD = your-password
NOTIFICATION_EMAIL = you@yourdomain.com
```

---

## ✅ Environment Variables Explained

| Variable | Required? | Description | Example |
|----------|-----------|-------------|---------|
| `EMAIL_HOST` | ✅ Yes | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | No (default: 587) | SMTP port | `587` or `465` |
| `EMAIL_SECURE` | No (default: false) | Use SSL? | `false` (587) or `true` (465) |
| `EMAIL_USER` | ✅ Yes | Email username | `your.email@gmail.com` |
| `EMAIL_PASSWORD` | ✅ Yes | Email password or app password | `your-app-password` |
| `NOTIFICATION_EMAIL` | No | Where to send notifications | `you@example.com` (defaults to EMAIL_USER) |

---

## 🧪 Testing Email Setup

After adding environment variables and redeploying:

### Test 1: Check Server Logs

1. Railway Dashboard → Deployments
2. Click on active deployment
3. View Logs
4. Look for: `✅ Email service initialized successfully`
5. Or: `📧 Email notifications disabled` (if not configured)

### Test 2: Submit a Test Form

1. Go to your landing page: https://quantum-residency-edge-city-production.up.railway.app/
2. Fill out the interest form
3. Submit
4. Check your email inbox!

### Test 3: Check Server Logs After Submission

Look for:
- `✅ Email notification sent: <message-id>`
- Or: `❌ Failed to send email notification: <error>`

---

## 🐛 Troubleshooting

### Issue: "Email notifications disabled"

**Solution:** Environment variables not set. Add them in Railway Variables tab.

### Issue: "Authentication failed"

**Solutions:**
- Gmail: Make sure you're using **App Password**, not regular password
- Gmail: Enable 2-Step Verification first
- Other: Check username and password are correct

### Issue: "Connection refused" or "ETIMEDOUT"

**Solutions:**
- Check `EMAIL_HOST` is correct
- Check `EMAIL_PORT` (587 or 465)
- If port 587 fails, try 465 with `EMAIL_SECURE=true`

### Issue: Email goes to Spam

**Solutions:**
- Use SendGrid or professional SMTP service
- Verify sender domain
- Add SPF/DKIM records (advanced)

### Issue: "Invalid login: 535 5.7.8"

**Solution:** For Gmail, you need an **App Password**, not your regular password.

---

## 🎨 Email Preview

When someone submits the form, you'll receive:

```
Subject: 🎯 New Quredge Submission from John Doe

🎉 New Quredge Interest Form Submission

Participant Details
-------------------
Name: John Doe
Email: john@example.com

What are they curious about?
I'm interested in quantum-web3 intersections and want to explore
distributed quantum computing possibilities.

Participation Type: Attendant

Institution: MIT

Submitted: January 17, 2026, 10:30 AM

📊 View all submissions:
[Go to Admin Dashboard]
```

---

## 🔒 Security Best Practices

1. **Never commit EMAIL_PASSWORD** to Git (it's in `.gitignore` ✅)
2. **Use App Passwords** (not your main email password)
3. **For Gmail:** Use dedicated account, not personal email
4. **For production:** Use SendGrid, Mailgun, or AWS SES
5. **Rotate passwords** if someone leaves your team

---

## 💡 Pro Tips

### Tip 1: Multiple Recipients

Want multiple people to receive notifications?

```
NOTIFICATION_EMAIL = person1@example.com,person2@example.com,person3@example.com
```

(Need to update code slightly - let me know if you want this!)

### Tip 2: Custom Email Template

The email template is in `email-service.js`. You can customize:
- Subject line
- HTML styling
- Text content
- Add your logo

### Tip 3: Email Filter/Label

Set up Gmail filter to:
- Label all `[From: Quredge Landing Page]` emails
- Star them automatically
- Forward to team members

---

## 📊 Current Status

After setup, emails will be sent:
- ✅ Every time someone submits the form
- ✅ Includes all form data
- ✅ Direct link to admin dashboard
- ✅ No delay (sent immediately)
- ✅ Won't block form submission (async)

---

## 🚀 Quick Start Checklist

- [ ] Choose email service (Gmail, SendGrid, or other)
- [ ] Get SMTP credentials (App Password or API Key)
- [ ] Add 6 environment variables to Railway
- [ ] Wait for redeploy (~2 minutes)
- [ ] Check logs for "Email service initialized"
- [ ] Test with a form submission
- [ ] Check your inbox! 📬

---

## 📞 Need Help?

Common issues:
1. **No emails arriving:** Check Railway logs for errors
2. **Authentication errors:** Verify EMAIL_USER and EMAIL_PASSWORD
3. **Connection errors:** Try different port (587 vs 465)
4. **Gmail blocked:** Create and use App Password

---

**Ready to set up? Follow Option 1 (Gmail) for the quickest setup!** ⚡

