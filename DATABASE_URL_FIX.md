# Database Connection Test

## Check if DATABASE_URL is set in Railway

**In Railway Dashboard:**

1. **Your app service** → **Variables** tab
2. **Look for `DATABASE_URL`**

**Should look like:**
```
DATABASE_URL = postgresql://username:password@hostname:5432/railway
```

**If MISSING:**
1. Click "+ New Variable"
2. Name: `DATABASE_URL`
3. Value: Get from PostgreSQL service Variables tab
4. Railway will auto-redeploy

---

## What the error means

"Error saving your response" = Database connection failed

**Common causes:**
1. ❌ DATABASE_URL not set
2. ❌ PostgreSQL service not linked
3. ❌ Wrong connection string
4. ❌ PostgreSQL service not started

---

## How to get DATABASE_URL

**Option 1: From PostgreSQL Service**
1. Click "Postgres" service (left panel)
2. Go to "Variables" tab
3. Find `DATABASE_URL` or `PGURL`
4. Copy the entire value
5. Add to your app service Variables

**Option 2: From PostgreSQL Connect Tab**
1. Click "Postgres" service
2. Go to "Connect" tab
3. Copy connection string
4. Add to your app Variables as `DATABASE_URL`

---

## After adding DATABASE_URL

1. Railway will auto-redeploy (~2 minutes)
2. Check logs: Should see "✅ Connected to PostgreSQL database"
3. Test form submission again
4. Should work!





