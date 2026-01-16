# Interest Form Implementation

## Overview

This document describes the interest form implementation for the Quredge landing page. The form replaces the "Interested in sponsoring?" button with a "Stay tuned!" button that opens a modal form.

## Features Implemented

### 1. Form Design
The form collects information in an optimized order:
1. **Name** (required) - Basic identity
2. **Email** (required) - Contact information
3. **Curiosity** (required) - What they're most interested in (open-ended)
4. **Participation Type** (required) - Attendant, Sponsor, or Both
5. **Institution** (optional) - Their affiliated organization
6. **Economic Support** (optional) - Whether they need financial assistance

**Question Order Rationale:**
- Start with basic contact info (name, email) - easy and builds momentum
- Ask about curiosity early while they're engaged - captures genuine interest
- Participation type is a key decision, so it comes after they've expressed interest
- Institution is optional context
- Economic support comes last as it's sensitive and optional

### 2. Backend & Database

**Technology Stack:**
- Node.js with Express.js
- SQLite database (lightweight, serverless)
- RESTful API endpoints

**Database Schema:**
```sql
CREATE TABLE interest_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  curiosity TEXT NOT NULL,
  participation TEXT NOT NULL,
  institution TEXT,
  economic_support TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**API Endpoints:**
- `POST /api/interest` - Submit form
- `GET /api/interest/all` - View all submissions (admin)
- `GET /api/interest/stats` - View statistics (admin)

### 3. Admin Dashboard

A comprehensive admin interface at `/admin.html` that provides:
- Real-time statistics (total submissions, attendants, sponsors, support requests)
- Searchable table of all submissions
- CSV export functionality
- Auto-refresh every 30 seconds

### 4. User Experience

**Form Modal:**
- Modern, accessible design matching the site aesthetic
- Real-time validation
- Clear error messages
- Success feedback with auto-close
- Keyboard navigation (ESC to close)
- Mobile responsive

**Frontend Validation:**
- Required field checking
- Email format validation
- User-friendly error messages

**Backend Validation:**
- Duplicate validation checks
- SQL injection protection via parameterized queries
- Error handling and logging

## Files Created/Modified

### New Files:
- `server.js` - Express server with API endpoints
- `package.json` - Node.js dependencies
- `css/form.css` - Form styling
- `js/form-handler.js` - Form submission logic
- `admin.html` - Admin dashboard
- `.gitignore` - Ignore database and node_modules
- `SETUP_GUIDE.md` - Comprehensive setup instructions
- `start.sh` - Quick start script

### Modified Files:
- `index.html` - Added form modal, updated CTA button

## Quick Start

### Option 1: Using the start script
```bash
./start.sh
```

### Option 2: Manual start
```bash
npm install
npm start
```

Then visit:
- Landing page: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin.html

## Data Access

### Via Admin Dashboard
Visit http://localhost:3000/admin.html to see:
- Total submissions and statistics
- Searchable table of all responses
- Export to CSV functionality

### Via SQLite CLI
```bash
sqlite3 quredge-interest.db
```

```sql
-- View all submissions
SELECT * FROM interest_forms ORDER BY submitted_at DESC;

-- Count by participation type
SELECT participation, COUNT(*) FROM interest_forms GROUP BY participation;

-- Find attendants needing support
SELECT name, email FROM interest_forms 
WHERE participation = 'attendant' 
AND economic_support IN ('yes', 'partial');
```

## Security Notes

**Current Implementation:**
- Basic validation and error handling
- Open admin endpoints (no authentication)
- CORS enabled for development

**Production Recommendations:**
1. Add authentication to admin endpoints
2. Implement rate limiting
3. Use HTTPS
4. Add CSRF protection
5. Implement more robust input sanitization
6. Add logging and monitoring
7. Use environment variables for configuration

## Customization

### Changing the Port
```bash
PORT=8080 npm start
```

### Modifying Form Fields
1. Update HTML in `index.html` (form modal section)
2. Update validation in `js/form-handler.js`
3. Update database schema in `server.js`
4. Update admin dashboard display in `admin.html`

### Email Notifications
To add email notifications when forms are submitted:
1. Install nodemailer: `npm install nodemailer`
2. Add email configuration to `server.js`
3. Send email in the POST `/api/interest` endpoint

## Testing

Test the form by:
1. Clicking "Stay tuned!" button
2. Filling out the form (try both valid and invalid inputs)
3. Submitting and checking for success message
4. Viewing submission in admin dashboard
5. Testing search and export features

## Support

For questions or issues:
- Check `SETUP_GUIDE.md` for detailed setup instructions
- Contact: quredge-team@edge.city

