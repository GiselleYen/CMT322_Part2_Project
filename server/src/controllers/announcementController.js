const AnnouncementModel = require('../models/announcement');

const announcementController = {
  async getAnnouncements(req, res) {
    try {
      const announcements = await AnnouncementModel.getAll();
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  },

  async updateAnnouncements(req, res) {
    try {
      const { announcements } = req.body;
      await AnnouncementModel.batchUpdate(announcements);
      res.json({ message: 'Announcements updated successfully' });
    } catch (error) {
      console.error('Error updating announcements:', error);
      res.status(500).json({ error: 'Failed to update announcements' });
    }
  },
};

module.exports = announcementController;