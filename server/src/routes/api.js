const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const announcementRoutes = require('./announcementRoutes'); 
const venueDateTimeRoutes = require('./venueDateTimeRoutes'); 
const { authenticateUser } = require('../middleware/auth');


router.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

router.use('/users', userRoutes);
router.use('/announcements', announcementRoutes); 
router.use('/venue-datetime', venueDateTimeRoutes); 

module.exports = router;