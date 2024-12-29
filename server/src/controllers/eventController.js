const Event = require('../models/Event');

const eventController = {
  async getEvents(req, res) {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  async createEvent(req, res) {
    try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.update(id, req.body);
      res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await Event.delete(id);
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },

  async bulkUpdateEvents(req, res) {
    try {
      const { events } = req.body;
      await Event.bulkUpdate(events);
      res.json({ message: 'Events updated successfully' });
    } catch (error) {
      console.error('Error bulk updating events:', error);
      res.status(500).json({ error: 'Failed to bulk update events' });
    }
  },
};

module.exports = eventController;