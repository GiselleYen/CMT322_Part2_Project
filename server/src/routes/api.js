const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const { authenticateUser } = require('../middleware/auth');

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

// Protected route
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

// Use user routes, which includes '/users'
router.use('/users', userRoutes);

module.exports = router;