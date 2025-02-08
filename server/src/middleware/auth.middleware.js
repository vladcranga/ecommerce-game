const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const [, authToken] = req.headers.authorization.split(' ');
      token = authToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized - No token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized - Invalid token' });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as admin' });
};
