const BestIntern = require('../models/bestIntern');

const bestInternController = {
  // Get all best interns
  async getBestInterns(req, res) {
    try {
      const bestInterns = await BestIntern.findAll();
      res.json(bestInterns);
    } catch (error) {
      console.error('Error fetching best interns:', error);
      res.status(500).json({ error: 'Failed to fetch best interns' });
    }
  },

  // Update an existing best intern
  async updateBestIntern(req, res) {
    try {
      const { id } = req.params;
      const updatedBestIntern = await BestIntern.update(id, req.body);
      res.json(updatedBestIntern);
    } catch (error) {
      console.error('Error updating best intern:', error);
      res.status(500).json({ error: 'Failed to update best intern' });
    }
  },

  // Bulk update best interns
  async bulkUpdateBestInterns(req, res) {
    try {
      const { bestInterns } = req.body; // Expecting an array of best interns with updates
      await BestIntern.bulkUpdate(bestInterns);
      res.json({ message: 'Best interns updated successfully' });
    } catch (error) {
      console.error('Error bulk updating best interns:', error);
      res.status(500).json({ error: 'Failed to bulk update best interns' });
    }
  },
};

module.exports = bestInternController;
