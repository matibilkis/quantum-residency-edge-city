# Database Backup & Persistence Guide

## 🗄️ Where is the Database?

**File:** `quredge-interest.db`
**Location:** Project root directory (`/app/quredge-interest.db` on Railway)

## ⚠️ Database Persistence on Railway

### Current Setup (Default):
- Database stored in **ephemeral filesystem**
- ✅ Persists during normal redeployments
- ⚠️ MAY be lost on major updates or service changes
- ❌ WILL be lost if service is deleted

### Recommended: Add Railway Volume

To make database persist permanently:

1. **Go to Railway Dashboard**
2. **Your service → Settings tab**
3. **Scroll to "Volumes" section**
4. **Click "+ New Volume"**
5. **Configure:**
   - Mount path: `/app`
   - This will persist ALL data in the app directory

After adding volume, database will NEVER be lost on redeployments!

## 💾 Backup Methods

### Method 1: CSV Export (Via Admin Dashboard) ⭐

**Easiest method - built into your admin panel**

1. Login: https://quantum-residency-edge-city-production.up.railway.app/admin.html
2. Click "Export CSV" button
3. All submissions saved to CSV file
4. **Frequency:** Do this weekly or after major data collection

**Pros:**
- ✅ No technical knowledge needed
- ✅ Human-readable format
- ✅ Easy to import into Excel/Google Sheets

**Cons:**
- ❌ Manual process
- ❌ Only exports form data (not full database structure)

### Method 2: Download Database File (Advanced)

**Add a backup endpoint to download the raw database file**

Add to `server.js`:

```javascript
// Database backup endpoint (admin only)
app.get('/api/admin/backup/database', auth.requireAdmin.bind(auth), (req, res) => {
  const dbPath = path.join(__dirname, 'quredge-interest.db');
  res.download(dbPath, `quredge-backup-${Date.now()}.db`);
});
```

Then visit:
```
https://quantum-residency-edge-city-production.up.railway.app/api/admin/backup/database
```

**Pros:**
- ✅ Complete database backup
- ✅ Includes all data and structure
- ✅ Can be restored exactly

**Cons:**
- ❌ Requires code change
- ❌ Binary file (not human-readable)

### Method 3: Automated Backups (Best for Production)

**Setup automated daily backups**

Option A: Use Railway Cron Jobs (if available)
Option B: Use GitHub Actions to backup
Option C: Use external service (Zapier, etc.)

## 🔄 Restore from Backup

### Restore from CSV:
1. Re-insert data via SQL or admin interface
2. Might need to write import script

### Restore from Database File:
1. Replace `quredge-interest.db` with backup
2. Redeploy service
3. All data restored exactly as it was

## 📊 What's in the Database?

**Table:** `interest_forms`

**Columns:**
- `id` - Auto-increment primary key
- `name` - Participant name
- `email` - Email address
- `curiosity` - What they're curious about
- `participation` - Attendant/Sponsor/Both
- `institution` - Optional institution
- `economic_support` - Optional field
- `submitted_at` - Timestamp (automatic)

## ✅ Recommended Backup Strategy

### For Your Use Case (Quantum Residency):

1. **Add Railway Volume** (one-time setup)
   - Ensures persistence across all deployments
   - No data loss risk

2. **Manual CSV Exports**
   - Export weekly during active registration period
   - Export daily in the final week before event
   - Store in Google Drive/Dropbox

3. **Post-Event Archival**
   - Final CSV export after event
   - Store in secure location
   - Optional: Keep database file as backup

### Backup Schedule:

| Phase | Frequency | Method |
|-------|-----------|--------|
| Pre-launch | Not needed | - |
| Active registration (month 1-2) | Weekly | CSV export |
| Peak registration (final 2 weeks) | Daily or every 2 days | CSV export |
| Post-event | One final backup | CSV + Database file |

## 🚨 Emergency: Data Loss Recovery

If database is lost and you don't have backup:
- ❌ Data cannot be recovered
- ✅ This is why backups are critical!

**Prevention is key!**

## 📝 Current Status Checklist

Check these off:

- [ ] Railway Volume added (for persistence)
- [ ] Know how to export CSV from admin
- [ ] Backup schedule decided
- [ ] Backup location chosen (Google Drive, etc.)
- [ ] Team knows who's responsible for backups
- [ ] Tested backup/restore process once

## 🔗 Quick Links

- **Admin Dashboard:** https://quantum-residency-edge-city-production.up.railway.app/admin.html
- **Railway Dashboard:** https://railway.com/project/1e98a6de-b069-44c3-89e7-975299f3ef6a
- **Database File:** `/app/quredge-interest.db` (on Railway server)

## 💡 Pro Tips

1. **Export CSV regularly** - It's your safety net
2. **Add Railway Volume** - One-time setup for peace of mind
3. **Test restore** - Try exporting and importing to verify process works
4. **Multiple backups** - Keep at least 2 recent copies
5. **Automate reminders** - Set calendar reminder for weekly exports

---

**Bottom line: Add a Railway Volume NOW, then export CSV weekly!** 🔒

