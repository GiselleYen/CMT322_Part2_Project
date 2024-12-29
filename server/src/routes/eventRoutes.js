const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Public routes
router.get('/', eventController.getEvents);

// Protected routes - require authentication
router.use(authenticateUser);

// Event management routes
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Bulk operations route (if needed)
router.put('/bulk/update', eventController.bulkUpdateEvents);

module.exports = router;