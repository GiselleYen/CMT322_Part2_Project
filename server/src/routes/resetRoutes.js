const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const eventController = require('../controllers/resetController');

// Public routes
router.get('/', eventController.resetUsers);

module.exports = router;