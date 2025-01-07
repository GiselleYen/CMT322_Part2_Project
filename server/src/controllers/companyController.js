const Company = require('../models/company');
// Controller for managing company-related API operations (CRUD)
const companyController = {
  async getCompanys(req, res) { // Get all companies from the database
    try {
      const companys = await Company.findAll(); // Fetch all companies using the Company model's findAll method
      res.json(companys);  // Respond with the list of companies in JSON format
    } catch (error) { // Log error and send a 500 server error response if fetching fails
      console.error('Error fetching companys:', error);
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  },
// Create a new company in the database
  async createCompany(req, res) {
    try { // Use the Company model's create method to create a new company
      const company = await Company.create(req.body);
      res.status(201).json(company); // Respond with the newly created company and a 201 status (Created)
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ error: 'Failed to create company' });
    }
  },
// Update an existing company's details
  async updateCompany(req, res) {
    try {
      const { id } = req.params; // Extract company ID from URL parameters
      const company = await Company.update(id, req.body); // Use the Company model's update method to update the company's data
      res.json(company); // Respond with the updated company data
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ error: 'Failed to update company' });
    }
  },
 // Delete an existing company from the database
  async deleteCompany(req, res) {
    try {
      const { id } = req.params; // Extract company ID from URL parameters
      await Company.delete(id); // Use the Company model's delete method to remove the company
      res.json({ message: 'Company deleted successfully' }); // Respond with a success message once the company is deleted
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  },

};
// Export the controller so it can be used in routes
module.exports = companyController;