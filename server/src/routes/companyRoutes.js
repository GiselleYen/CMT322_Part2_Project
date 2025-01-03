const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const eventController = require('../controllers/companyController');

// Public routes
router.get('/', eventController.getCompanys);

// Protected routes - require authentication
router.use(authenticateUser);

// Event management routes
router.post('/', eventController.createCompany);
router.put('/:id', eventController.updateCompany);
router.delete('/:id', eventController.deleteCompany);

// Bulk operations route (if needed)
//outer.put('/bulk/update', eventController.bulkUpdateEvents);

module.exports = router;