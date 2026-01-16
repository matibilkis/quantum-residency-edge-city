// Load environment variables from .env file
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
const PORT = process.env.PORT || 3000;

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
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database('./quredge-interest.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
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
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Interest forms table ready.');
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

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin page (requires authentication)
app.get('/admin.html', auth.requireAuth.bind(auth), (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('\nDatabase connection closed.');
    process.exit(0);
  });
});

