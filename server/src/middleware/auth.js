// server/src/middleware/auth.js
const { admin } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified:', decodedToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateUser };