const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');  // Ensure the path is correct
const { authenticateUser } = require('../middleware/auth');

// Submit Feedback (Authenticated)
router.post('/', authenticateUser, feedbackController.submitFeedback); // Use the correct function reference here

// Get All Feedback
router.get('/', feedbackController.getAllFeedback);

// Update Feedback Status
router.put('/:id', feedbackController.updateFeedbackStatus);

module.exports = router;
