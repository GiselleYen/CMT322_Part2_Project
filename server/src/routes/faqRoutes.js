const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const faqController = require('../controllers/faqController');

// Public: Get all FAQs
router.get('/', faqController.getFAQs);

// Admin: Add, update, or delete FAQs
router.post('/', authenticateUser, faqController.addFAQ);
router.put('/:id', authenticateUser, faqController.updateFAQ);
router.delete('/:id', authenticateUser, faqController.deleteFAQ);

module.exports = router;
