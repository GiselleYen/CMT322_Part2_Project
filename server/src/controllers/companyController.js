const Company = require('../models/company');

const companyController = {
  async getCompanys(req, res) {
    try {
      const companys = await Company.findAll();
      res.json(companys);
    } catch (error) {
      console.error('Error fetching companys:', error);
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  },

  async createCompany(req, res) {
    try {
      const company = await Company.create(req.body);
      res.status(201).json(company);
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ error: 'Failed to create company' });
    }
  },

  async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const company = await Company.update(id, req.body);
      res.json(company);
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ error: 'Failed to update company' });
    }
  },

  async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      await Company.delete(id);
      res.json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  },

/*  async bulkUpdateEvents(req, res) {
    try {
      const { events } = req.body;
      await Event.bulkUpdate(events);
      res.json({ message: 'Events updated successfully' });
    } catch (error) {
      console.error('Error bulk updating events:', error);
      res.status(500).json({ error: 'Failed to bulk update events' });
    }
  },*/
};

module.exports = companyController;