# Quredge Landing Page - Setup Guide

## Overview

This landing page includes an interest form that collects information from potential attendees and sponsors for the Quantum Residency program. The form data is stored in a SQLite database.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
```bash
cd /home/mbilkis/quredge-landing
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will start on `http://localhost:3000`

## Features

### Interest Form
- **Location**: Click on "Stay tuned!" button on the landing page
- **Purpose**: Collect early interest from potential attendees and sponsors
- **Data Collected**:
  1. Name (required)
  2. Email (required)
  3. Curiosity about the residency (required)
  4. Participation type: Attendant/Sponsor/Both (required)
  5. Institution (optional)
  6. Economic support needed (optional)

### Database
- **Type**: SQLite
- **Location**: `./quredge-interest.db` (automatically created)
- **Table**: `interest_forms`

## API Endpoints

### Submit Interest Form
- **Endpoint**: `POST /api/interest`
- **Body**: JSON with form fields
- **Response**: Success/error message

### View All Submissions (Admin)
- **Endpoint**: `GET /api/interest/all`
- **Response**: Array of all submissions
- **Access**: Open (consider adding authentication for production)

### View Statistics (Admin)
- **Endpoint**: `GET /api/interest/stats`
- **Response**: Statistics about submissions
- **Access**: Open (consider adding authentication for production)

## Accessing the Data

### View Submissions
Visit `http://localhost:3000/admin.html` to see all submissions in a user-friendly dashboard.

### Direct Database Access
You can also query the database directly using SQLite:

```bash
sqlite3 quredge-interest.db
```

Example queries:
```sql
-- View all submissions
SELECT * FROM interest_forms ORDER BY submitted_at DESC;

-- Count by participation type
SELECT participation, COUNT(*) as count FROM interest_forms GROUP BY participation;

-- View attendees needing economic support
SELECT name, email, institution FROM interest_forms 
WHERE participation = 'attendant' AND economic_support IN ('partial', 'yes');

-- Export to CSV (from command line)
sqlite3 -header -csv quredge-interest.db "SELECT * FROM interest_forms;" > submissions.csv
```

## Security Considerations

**Important**: Before deploying to production:

1. **Add Authentication**: The admin endpoints should be protected with authentication
2. **Rate Limiting**: Add rate limiting to prevent spam submissions
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Store sensitive configuration in environment variables
5. **Input Sanitization**: Additional validation and sanitization is recommended
6. **CORS**: Configure CORS properly for your domain

## Production Deployment

### Using a Process Manager (PM2)
```bash
npm install -g pm2
pm2 start server.js --name quredge-landing
pm2 save
pm2 startup
```

### Using systemd (Linux)
Create a service file at `/etc/systemd/system/quredge-landing.service`

### Behind a Reverse Proxy
Configure Nginx or Apache to proxy requests to the Node.js server running on port 3000.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, set a different port:
```bash
PORT=8080 npm start
```

### Database Locked
If you get a "database is locked" error, ensure no other process is accessing the database file.

### Form Not Submitting
Check the browser console for errors and ensure the API endpoint URL is correct in `js/form-handler.js`.

## File Structure

```
quredge-landing/
├── server.js                 # Express server and API endpoints
├── package.json              # Dependencies
├── index.html               # Main landing page
├── admin.html               # Admin dashboard (to be created)
├── css/
│   ├── form.css            # Form styling
│   └── ...                 # Other CSS files
├── js/
│   ├── form-handler.js     # Form submission logic
│   └── ...                 # Other JS files
└── quredge-interest.db     # SQLite database (auto-created)
```

## Support

For questions or issues, contact: quredge-team@edge.city

