const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const internshipTipController = require('../controllers/internshipTipController.js');

// Public routes
router.get('/', internshipTipController.getInternshipTips);

// Protected routes - require authentication
router.use(authenticateUser);

// Internship tip management routes
router.post('/', internshipTipController.createInternshipTip);
router.put('/:id', internshipTipController.updateInternshipTip);
router.delete('/:id', internshipTipController.deleteInternshipTip);

// Bulk operations route (if needed)
router.put('/bulk/update', internshipTipController.bulkUpdateInternshipTips);

module.exports = router;
