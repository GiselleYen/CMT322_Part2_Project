const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const bestInternController = require('../controllers/bestInternController.js');

// Public routes
router.get('/', bestInternController.getBestInterns);

// Protected routes - require authentication
router.use(authenticateUser);

// Best intern management routes
router.put('/:id', bestInternController.updateBestIntern);

// Bulk operations route
router.put('/bulk/update', bestInternController.bulkUpdateBestInterns);

module.exports = router;
