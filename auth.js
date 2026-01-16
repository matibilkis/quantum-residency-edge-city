const bcrypt = require('bcryptjs');

// Authentication middleware
class Auth {
  constructor() {
    // In production, these should come from environment variables
    this.adminUsername = process.env.ADMIN_USERNAME || 'admin';
    this.adminPasswordHash = null;
    this.initializePassword();
  }
  
  async initializePassword() {
    const plainPassword = process.env.ADMIN_PASSWORD || 'quredge2026';
    this.adminPasswordHash = await bcrypt.hash(plainPassword, 10);
    
    if (!process.env.ADMIN_PASSWORD) {
      console.warn('⚠️  WARNING: Using default admin password!');
      console.warn('   Please set ADMIN_PASSWORD environment variable for production.');
      console.warn('   Default credentials - Username: admin, Password: quredge2026');
    }
  }
  
  async verifyPassword(username, password) {
    if (username !== this.adminUsername) {
      return false;
    }
    
    if (!this.adminPasswordHash) {
      await this.initializePassword();
    }
    
    return await bcrypt.compare(password, this.adminPasswordHash);
  }
  
  // Middleware to check if user is authenticated
  requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
      return next();
    }
    
    // If it's an API request, return JSON error
    if (req.path.startsWith('/api/admin')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // For HTML pages, redirect to login
    res.redirect('/login.html');
  }
  
  // Login handler
  async handleLogin(req, res) {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password required' 
      });
    }
    
    const isValid = await this.verifyPassword(username, password);
    
    if (isValid) {
      req.session.authenticated = true;
      req.session.username = username;
      
      return res.json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  }
  
  // Logout handler
  handleLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.json({ success: true, message: 'Logged out' });
    });
  }
  
  // Check auth status
  checkStatus(req, res) {
    if (req.session && req.session.authenticated) {
      res.json({ 
        authenticated: true, 
        username: req.session.username 
      });
    } else {
      res.json({ authenticated: false });
    }
  }
}

module.exports = new Auth();

