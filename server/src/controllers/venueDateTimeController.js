const VenueDateTime = require('../models/venueDateTime');

const venueDateTimeController = {
  async getVenueDateTime(req, res) {
    try {
      const venueDateTime = await VenueDateTime.findLatest();
      res.json(venueDateTime);
    } catch (error) {
      console.error('Error in getVenueDateTime:', error);
      res.status(500).json({ error: 'Failed to fetch venue datetime' });
    }
  },

  async updateVenueDateTime(req, res) {
    try {
      const venueData = req.body;
      
      // Validate input data
      await VenueDateTime.validateData(venueData);
      
      // Update or create venue datetime
      const updatedVenue = await VenueDateTime.updateOrCreate(venueData);
      
      res.json({ 
        message: 'Venue datetime updated successfully',
        data: updatedVenue
      });
    } catch (error) {
      console.error('Error in updateVenueDateTime:', error);
      res.status(500).json({ 
        error: 'Failed to update venue datetime',
        message: error.message 
      });
    }
  }
};

module.exports = venueDateTimeController;