const express = require('express');
const router = express.Router();
const eventController = require('../controllers/resetController'); // Controller that handles the business logic related to password reset operations

// Public routes
router.get('/', eventController.resetUsers);

module.exports = router; // Export the router so it can be used in the main server file