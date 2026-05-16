const jwt = require('jsonwebtoken');

// Session-based auth check
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
};

// Admin check
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Access denied. Admins only.');
  res.redirect('/');
};

// JWT verification (for API routes)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { isAuthenticated, isAdmin, verifyToken };
