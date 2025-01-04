const Reset = require('../models/reset');

const resetController = {
  async resetUsers(req, res) {
    try {
      const detail = await Reset.findAll();
      res.json(detail);
    } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'Failed to fetch information' });
    }
  },
};

module.exports = resetController;