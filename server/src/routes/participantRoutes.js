const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const participantController = require('../controllers/participantController');

router.get('/', participantController.getParticipants);
router.get('/statistics', participantController.getStatistics);

module.exports = router;

