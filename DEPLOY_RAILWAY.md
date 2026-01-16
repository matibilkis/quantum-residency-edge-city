# Deploy to Railway - Step-by-Step Guide

Railway is the recommended hosting platform for Quredge landing page. It's simple, affordable, and perfect for this project.

## Why Railway?

- ✅ **Easy**: Deploy in ~5 minutes
- ✅ **Affordable**: ~$5/month (500 hours free on trial)
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **GitHub Integration**: Auto-deploy on push
- ✅ **Environment Variables**: Easy to manage
- ✅ **Database Included**: SQLite works perfectly

## Step-by-Step Deployment

### Step 1: Prepare Your Code

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment with authentication"

# Push to GitHub (create repo if needed)
git remote add origin https://github.com/YOUR_USERNAME/quredge-landing.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your repositories

### Step 3: Deploy Your Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `quredge-landing` repository
4. Railway will automatically:
   - Detect it's a Node.js project
   - Run `npm install`
   - Start your server

### Step 4: Set Environment Variables

**IMPORTANT**: This is where you set your secure credentials!

1. In Railway dashboard, click on your project
2. Go to "Variables" tab
3. Add these variables:

```
ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=your_random_secret_32chars
NODE_ENV=production
```

**To generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Click "Add" for each variable

### Step 5: Get Your URL

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. You'll get a URL like: `quredge-landing.up.railway.app`

**Optional**: Add your custom domain here if you have one.

### Step 6: Test Your Deployment

1. Visit your Railway URL
2. Verify the landing page loads
3. Click "Stay tuned!" button - test the form
4. Visit `/login.html` 
5. Login with your credentials
6. Access admin dashboard
7. Submit a test form and verify it appears in admin

### Step 7: Set Up Auto-Deploy (Optional)

Railway automatically deploys when you push to GitHub!

```bash
# Make a change
echo "# Deployed!" >> README.md
git add .
git commit -m "Update README"
git push

# Railway automatically deploys the new version!
```

## Cost Breakdown

### Free Trial
- $5 credit per month
- ~500 hours of usage
- Perfect for testing

### Paid Plan
- $5/month base
- Pay for what you use
- Estimated $5-10/month for this project
- Includes:
  - Automatic HTTPS
  - Unlimited deployments
  - 8GB RAM
  - Environment variables
  - GitHub integration

## Custom Domain Setup (Optional)

### If you have a domain (e.g., quredge.com):

1. In Railway dashboard → Settings → Domains
2. Click "Custom Domain"
3. Enter your domain: `quredge.com`
4. Railway shows you DNS records to add
5. In your domain registrar (Namecheap, GoDaddy, etc.):
   - Add CNAME record as shown
   - Wait 5-60 minutes for DNS propagation
6. Done! Your site is at your custom domain

## Backing Up Your Database

### Option 1: Manual Download
Railway provides SSH access to download your database:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Download database
railway run 'cat quredge-interest.db' > backup.db
```

### Option 2: Add Backup Command
Add to `package.json`:

```json
"scripts": {
  "backup": "cp quredge-interest.db backups/quredge-$(date +%Y%m%d).db"
}
```

## Monitoring

### View Logs
1. In Railway dashboard
2. Click "Deployments" tab
3. Click latest deployment
4. View real-time logs

### Check Status
- Green = Running
- Yellow = Deploying
- Red = Error (check logs)

## Troubleshooting

### Deployment Failed
- Check logs for errors
- Verify `package.json` is correct
- Make sure all dependencies are listed

### Can't Access Admin
- Verify environment variables are set
- Check you used correct variable names (case-sensitive)
- Try redeploying: Deployments → three dots → Redeploy

### Form Not Submitting
- Check browser console for errors
- Verify API endpoint URLs (should use same domain)
- Check CORS settings if using custom domain

### Database Not Persisting
- Railway uses volumes for persistence
- Check Settings → Volumes
- Should see a volume mounted at `/app`

## Security Checklist

Before going live:

- [ ] Changed ADMIN_PASSWORD from default
- [ ] Set strong SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Tested login/logout functionality
- [ ] Tested form submission
- [ ] Verified admin endpoints require auth
- [ ] Set up database backup system
- [ ] Reviewed logs for any errors

## Updating Your Site

```bash
# Make changes locally
# Test locally with: npm start

# Commit and push
git add .
git commit -m "Update site"
git push

# Railway automatically deploys!
# Check deployment status in Railway dashboard
```

## Alternative: Deploy to DigitalOcean App Platform

If you prefer DigitalOcean:

1. Go to https://cloud.digitalocean.com
2. Create → Apps
3. Connect GitHub repository
4. Set environment variables (same as Railway)
5. Deploy!

**Cost**: $5/month basic plan

## Next Steps After Deployment

1. **Test Everything**: Form, login, admin dashboard
2. **Set Up Backups**: Download database weekly
3. **Monitor**: Check logs occasionally
4. **Update Dependencies**: Run `npm update` monthly
5. **Share**: Send the URL to your team!

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Help**: quredge-team@edge.city

---

**You're ready to go live! 🚀**

Your site will be accessible at: `https://your-project.up.railway.app`
Admin login: `https://your-project.up.railway.app/login.html`

