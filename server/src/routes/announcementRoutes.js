const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

router.get('/', announcementController.getAnnouncements);
router.put('/', authenticateUser, announcementController.updateAnnouncements);

module.exports = router;
