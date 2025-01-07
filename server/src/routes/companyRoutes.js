const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth'); // Middleware to authenticate the user before performing protected routes
const eventController = require('../controllers/companyController'); // Controller that handles the business logic related to company data

// Public routes - No authentication required
router.get('/', eventController.getCompanys);

// Protected routes - require authentication
router.use(authenticateUser); // Ensures the user is authenticated for the following routes

// Company management routes
router.post('/', eventController.createCompany); // Create a new company
router.put('/:id', eventController.updateCompany); // Update a company by ID
router.delete('/:id', eventController.deleteCompany); // Delete a company by ID


module.exports = router; // Export the router so it can be used in the main server file