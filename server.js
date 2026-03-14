// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const auth = require('./auth-roles');
const emailService = require('./email-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - required for Railway/Heroku/etc
app.set('trust proxy', 1);

// Rate limiting for form submissions
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per 15 minutes per IP
  message: { success: false, message: 'Too many submissions. Please try again later.' }
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow cookies on same-site navigation
  }
}));

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection and create table
async function initializeDatabase() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS interest_forms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        curiosity TEXT NOT NULL,
        participation TEXT NOT NULL,
        institution TEXT,
        economic_support TEXT,
        checked_in BOOLEAN DEFAULT FALSE,
        checked_in_at TIMESTAMP,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);

    // Migration: add columns if they don't exist (for existing databases)
    await pool.query(`ALTER TABLE interest_forms ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE`);
    await pool.query(`ALTER TABLE interest_forms ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP`);

    console.log('✅ Interest forms table ready');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
}

// Initialize database on startup
initializeDatabase();

// Authentication Routes
app.post('/api/auth/login', (req, res) => auth.handleLogin(req, res));
app.post('/api/auth/logout', (req, res) => auth.handleLogout(req, res));
app.get('/api/auth/status', (req, res) => auth.checkStatus(req, res));

// API Routes

// Submit interest form (public endpoint with rate limiting)
app.post('/api/interest', formLimiter, async (req, res) => {
  const { name, email, curiosity, participation, institution } = req.body;
  
  // Validate required fields
  if (!name || !email || !curiosity || !participation) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all required fields.' 
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address.' 
    });
  }
  
  const insertQuery = `
    INSERT INTO interest_forms (name, email, curiosity, participation, institution)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  
  try {
    const result = await pool.query(insertQuery, [name, email, curiosity, participation, institution || null]);
    const submissionId = result.rows[0].id;
    
    // Send email notification (async, don't wait for it)
    emailService.sendFormSubmissionNotification({
      name,
      email,
      curiosity,
      participation,
      institution
    }).catch(err => {
      // Log email error but don't fail the request
      console.error('Email notification failed:', err.message);
    });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your interest! We\'ll be in touch.',
      id: submissionId
    });
  } catch (err) {
    console.error('Error inserting data:', err.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Error saving your response. Please try again.' 
    });
  }
});

// Get all submissions (admin endpoint - authentication required)
app.get('/api/admin/interest/all', auth.requireAuth.bind(auth), async (req, res) => {
  const query = 'SELECT * FROM interest_forms ORDER BY submitted_at DESC';
  
  try {
    const result = await pool.query(query);
    
    res.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving data.' 
    });
  }
});

// Get statistics (admin endpoint - authentication required)
app.get('/api/admin/interest/stats', auth.requireAuth.bind(auth), async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM interest_forms');
    const participationResult = await pool.query('SELECT participation, COUNT(*) as count FROM interest_forms GROUP BY participation');
    
    const stats = {
      total: parseInt(totalResult.rows[0].count),
      byParticipation: participationResult.rows
    };
    
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    return res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// QR Code Check-in: look up attendee by ID (admin only)
app.get('/api/admin/checkin/lookup/:id', auth.requireAuth.bind(auth), async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid attendee ID.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, participation, institution, checked_in, checked_in_at FROM interest_forms WHERE id = $1',
      [parsedId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendee not found.' });
    }
    res.json({ success: true, attendee: result.rows[0] });
  } catch (err) {
    console.error('Error looking up attendee:', err.message);
    res.status(500).json({ success: false, message: 'Error looking up attendee.' });
  }
});

// QR Code Check-in: mark attendee as checked in (admin only)
app.post('/api/admin/checkin', auth.requireAuth.bind(auth), async (req, res) => {
  const { id } = req.body;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid attendee ID.' });
  }

  try {
    const lookup = await pool.query(
      'SELECT id, name, email, participation, institution, checked_in, checked_in_at FROM interest_forms WHERE id = $1',
      [parsedId]
    );
    if (lookup.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendee not found.' });
    }
    const attendee = lookup.rows[0];
    if (attendee.checked_in) {
      return res.status(409).json({ success: false, message: 'Attendee already checked in.', attendee });
    }

    const now = new Date().toISOString();
    await pool.query(
      'UPDATE interest_forms SET checked_in = TRUE, checked_in_at = $1 WHERE id = $2',
      [now, parsedId]
    );
    res.json({
      success: true,
      message: 'Checked in successfully.',
      attendee: { ...attendee, checked_in: true, checked_in_at: now }
    });
  } catch (err) {
    console.error('Error processing check-in:', err.message);
    res.status(500).json({ success: false, message: 'Error processing check-in.' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin page (requires authentication)
app.get('/admin.html', auth.requireAuth.bind(auth), (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve QR scanner page (requires authentication)
app.get('/qr-scanner.html', auth.requireAuth.bind(auth), (req, res) => {
  res.sendFile(path.join(__dirname, 'qr-scanner.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('\n✅ Database connection pool closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error closing database:', err.message);
    process.exit(1);
  }
});

