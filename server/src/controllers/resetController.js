const Reset = require('../models/reset');
// Controller for managing user reset-related operations
const resetController = {
  async resetUsers(req, res) {  // Fetch all user information for resetting purposes
    try {
      const detail = await Reset.findAll(); // Use the Reset model to get the list of all users
      res.json(detail); // Respond with the retrieved user details in JSON format
    } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'Failed to fetch information' });
    }
  },
};
// Export the controller so it can be used in routes
module.exports = resetController;