// middleware/protectEmployer.js
const jwt = require('jsonwebtoken');
const Employer = require('../models/employer');

const protectEmployer = async (req, res, next) => {
  try {

    // Step 1 — Check token exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided, access denied'
      });
    }

    // Step 2 — Extract token
    const token = authHeader.split(' ')[1];

    // Step 3 — Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4 — Find employer in DB
    const employer = await Employer.findById(decoded.id)
      .select('-password');

    if (!employer) {
      return res.status(401).json({
        message: 'Employer not found, access denied'
      });
    }

    // Step 5 — Attach employer to request
    req.senderId = decoded.id;
    req.employer = employer;

    next(); // move to next function

  } catch (error) {

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired, please login again'
      });
    }

    res.status(500).json({ message: error.message });
  }
}

// middleware/protectEmployer.js
// Add this below protectEmployer

const requireSubscription = async (req, res, next) => {
  try {
    if (!req.employer.isSubscribed) {
      return res.status(403).json({
        message: 'Subscribe as a Partner to access this feature'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { protectEmployer, requireSubscription };