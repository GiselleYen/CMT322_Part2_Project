const ParticipantModel = require('../models/participant');

const participantController = {
  async getParticipants(req, res) {
    try {
      const participants = await ParticipantModel.getAllParticipants();
      res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error); // Log the detailed error on the server
        res.status(500).json({
          message: 'Failed to fetch participants',
          error: error.message || error // Send the error message back to the frontend
        });
      }
  },

  

  async getStatistics(req, res) {
    try {
      const stats = await ParticipantModel.getStatistics();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ message: 'Failed to fetch statistics', error });
    }
  },
};

module.exports = participantController;
