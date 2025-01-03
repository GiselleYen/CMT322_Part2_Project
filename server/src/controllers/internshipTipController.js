const InternshipTip = require('../models/internshipTip');

const internshipTipController = {
  // Get all internship tips
  async getInternshipTips(req, res) {
    try {
      const internshipTips = await InternshipTip.findAll();
      res.json(internshipTips);
    } catch (error) {
      console.error('Error fetching internship tips:', error);
      res.status(500).json({ error: 'Failed to fetch internship tips' });
    }
  },

  // Create a new internship tip
  async createInternshipTip(req, res) {
    try {
      const internshipTip = await InternshipTip.create(req.body);
      res.status(201).json(internshipTip);
    } catch (error) {
      console.error('Error creating internship tip:', error);
      res.status(500).json({ error: 'Failed to create internship tip' });
    }
  },

  // Update an existing internship tip
  async updateInternshipTip(req, res) {
    try {
      const { id } = req.params;
      const internshipTip = await InternshipTip.update(id, req.body);
      res.json(internshipTip);
    } catch (error) {
      console.error('Error updating internship tip:', error);
      res.status(500).json({ error: 'Failed to update internship tip' });
    }
  },

  // Delete an internship tip
  async deleteInternshipTip(req, res) {
    try {
      const { id } = req.params;
      await InternshipTip.delete(id);
      res.json({ message: 'Internship tip deleted successfully' });
    } catch (error) {
      console.error('Error deleting internship tip:', error);
      res.status(500).json({ error: 'Failed to delete internship tip' });
    }
  },

  // Bulk update internship tips
  async bulkUpdateInternshipTips(req, res) {
    try {
      const { internshipTips } = req.body;
      await InternshipTip.bulkUpdate(internshipTips);
      res.json({ message: 'Internship tips updated successfully' });
    } catch (error) {
      console.error('Error bulk updating internship tips:', error);
      res.status(500).json({ error: 'Failed to bulk update internship tips' });
    }
  },
};

module.exports = internshipTipController;
