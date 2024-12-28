const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const venueDateTimeController = require('../controllers/venueDateTimeController');

router.get('/', venueDateTimeController.getVenueDateTime);
router.post('/', authenticateUser, venueDateTimeController.updateVenueDateTime);

module.exports = router;