const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const announcementRoutes = require('./announcementRoutes'); 
const venueDateTimeRoutes = require('./venueDateTimeRoutes'); 
const eventRoutes = require('./eventRoutes'); 
const faqRoutes = require('./faqRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const participantRoutes = require('./participantRoutes');
const companyRoutes = require('./companyRoutes');

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
router.use('/events', eventRoutes);
router.use('/faqs', faqRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/participants', participantRoutes);
router.use('/companys', companyRoutes);
module.exports = router;