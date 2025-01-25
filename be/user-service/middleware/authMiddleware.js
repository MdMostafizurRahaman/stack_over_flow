const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    try {
      console.log('Decoded Token:', decoded); // Debug
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        console.error('User not found for email:', decoded.email); // Debug
        return res.status(401).json({ message: 'Unauthorized: User not found.' });
      }
      req.user = user; // Attach user to request
      next();
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Error fetching user.' });
    }
  });
};
