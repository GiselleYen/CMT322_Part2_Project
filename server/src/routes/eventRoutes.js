const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Public route to get all events
router.get('/', eventController.getEvents);

// Protected routes
router.post('/', authenticateUser, eventController.addEvent);
router.put('/:id', authenticateUser, eventController.updateEvent);
router.delete('/:id', authenticateUser, eventController.deleteEvent);

module.exports = router;
