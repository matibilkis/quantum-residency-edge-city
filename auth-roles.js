const bcrypt = require('bcryptjs');

// Multi-user authentication with roles
class AuthWithRoles {
  constructor() {
    // Admin user (full access)
    this.adminUsername = process.env.ADMIN_USERNAME || 'admin';
    this.adminPasswordHash = null;
    
    // Viewer user (read-only)
    this.viewerUsername = process.env.VIEWER_USERNAME || 'viewer';
    this.viewerPasswordHash = null;
    
    this.initializePasswords();
  }
  
  async initializePasswords() {
    // Admin password
    const adminPassword = process.env.ADMIN_PASSWORD || 'quredge2026';
    this.adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    
    // Viewer password
    const viewerPassword = process.env.VIEWER_PASSWORD || 'viewer2026';
    this.viewerPasswordHash = await bcrypt.hash(viewerPassword, 10);
    
    if (!process.env.ADMIN_PASSWORD || !process.env.VIEWER_PASSWORD) {
      console.warn('⚠️  WARNING: Using default passwords!');
      console.warn('   Please set ADMIN_PASSWORD and VIEWER_PASSWORD environment variables.');
      console.warn('   Default credentials:');
      console.warn('   Admin - Username: admin, Password: quredge2026');
      console.warn('   Viewer - Username: viewer, Password: viewer2026');
    }
  }
  
  async verifyPassword(username, password) {
    // Check admin
    if (username === this.adminUsername) {
      if (!this.adminPasswordHash) {
        await this.initializePasswords();
      }
      const isValid = await bcrypt.compare(password, this.adminPasswordHash);
      return isValid ? { valid: true, role: 'admin' } : { valid: false };
    }
    
    // Check viewer
    if (username === this.viewerUsername) {
      if (!this.viewerPasswordHash) {
        await this.initializePasswords();
      }
      const isValid = await bcrypt.compare(password, this.viewerPasswordHash);
      return isValid ? { valid: true, role: 'viewer' } : { valid: false };
    }
    
    return { valid: false };
  }
  
  // Middleware to check if user is authenticated (any role)
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
  
  // Middleware to check if user is admin (not viewer)
  requireAdmin(req, res, next) {
    if (req.session && req.session.authenticated && req.session.role === 'admin') {
      return next();
    }
    
    if (req.session && req.session.authenticated && req.session.role === 'viewer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required. You have read-only access.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
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
    
    const result = await this.verifyPassword(username, password);
    
    if (result.valid) {
      req.session.authenticated = true;
      req.session.username = username;
      req.session.role = result.role;
      
      return res.json({ 
        success: true, 
        message: 'Login successful',
        role: result.role
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
        username: req.session.username,
        role: req.session.role
      });
    } else {
      res.json({ authenticated: false });
    }
  }
}

module.exports = new AuthWithRoles();

