// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  console.log('Token received:', req.cookies.token);

  if (req.cookies.token) {
    try {
      // Verify token
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      // Add user from payload
      console.log('User ID from token:', decoded.id);
      req.user = decoded.id;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = protect;
