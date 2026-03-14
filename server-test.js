// Test version of server (doesn't start listening, just exports app)
require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const auth = require('./auth');

const app = express();

// Use test database if in test mode
const dbName = process.env.NODE_ENV === 'test' 
  ? (process.env.TEST_DB || 'quredge-interest-test.db')
  : 'quredge-interest.db';

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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database(`./${dbName}`, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to the SQLite database.');
    }
    initializeDatabase();
  }
});

// Create table if it doesn't exist
function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS interest_forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      curiosity TEXT NOT NULL,
      participation TEXT NOT NULL,
      institution TEXT,
      economic_support TEXT,
      checked_in INTEGER DEFAULT 0,
      checked_in_at DATETIME,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.log('Interest forms table ready.');
      }
      // Migration: add columns if they don't exist (for existing databases)
      db.run('ALTER TABLE interest_forms ADD COLUMN checked_in INTEGER DEFAULT 0', () => {});
      db.run('ALTER TABLE interest_forms ADD COLUMN checked_in_at DATETIME', () => {});
    }
  });
}

// Authentication Routes
app.post('/api/auth/login', (req, res) => auth.handleLogin(req, res));
app.post('/api/auth/logout', (req, res) => auth.handleLogout(req, res));
app.get('/api/auth/status', (req, res) => auth.checkStatus(req, res));

// API Routes

// Submit interest form (public endpoint with rate limiting)
app.post('/api/interest', formLimiter, (req, res) => {
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
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(insertQuery, [name, email, curiosity, participation, institution || null], function(err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Error saving your response. Please try again.' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for your interest! We\'ll be in touch.',
      id: this.lastID
    });
  });
});

// Get all submissions (admin endpoint - authentication required)
app.get('/api/admin/interest/all', auth.requireAuth.bind(auth), (req, res) => {
  const query = 'SELECT * FROM interest_forms ORDER BY submitted_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Error retrieving data.' 
      });
    }
    
    res.json({ 
      success: true, 
      data: rows,
      count: rows.length
    });
  });
});

// Get statistics (admin endpoint - authentication required)
app.get('/api/admin/interest/stats', auth.requireAuth.bind(auth), (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM interest_forms',
    byParticipation: 'SELECT participation, COUNT(*) as count FROM interest_forms GROUP BY participation'
  };
  
  const stats = {};
  
  db.get(queries.total, [], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching stats.' });
    }
    stats.total = row.count;
    
    db.all(queries.byParticipation, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error fetching stats.' });
      }
      stats.byParticipation = rows;
      
      res.json({ success: true, stats });
    });
  });
});

// QR Code Check-in: look up attendee by ID (admin only)
app.get('/api/admin/checkin/lookup/:id', auth.requireAuth.bind(auth), (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid attendee ID.' });
  }

  db.get('SELECT id, name, email, participation, institution, checked_in, checked_in_at FROM interest_forms WHERE id = ?', [parsedId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error looking up attendee.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Attendee not found.' });
    }
    res.json({ success: true, attendee: row });
  });
});

// QR Code Check-in: mark attendee as checked in (admin only)
app.post('/api/admin/checkin', auth.requireAuth.bind(auth), (req, res) => {
  const { id } = req.body;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid attendee ID.' });
  }

  db.get('SELECT id, name, email, participation, institution, checked_in, checked_in_at FROM interest_forms WHERE id = ?', [parsedId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error processing check-in.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Attendee not found.' });
    }
    if (row.checked_in) {
      return res.status(409).json({ success: false, message: 'Attendee already checked in.', attendee: row });
    }

    const now = new Date().toISOString();
    db.run('UPDATE interest_forms SET checked_in = 1, checked_in_at = ? WHERE id = ?', [now, parsedId], function(updateErr) {
      if (updateErr) {
        return res.status(500).json({ success: false, message: 'Error saving check-in.' });
      }
      res.json({
        success: true,
        message: 'Checked in successfully.',
        attendee: { ...row, checked_in: 1, checked_in_at: now }
      });
    });
  });
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

// Export app for testing (don't start server)
module.exports = app;

