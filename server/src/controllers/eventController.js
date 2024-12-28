const { db, admin } = require('../config/firebase');

const eventController = {
  // Get all events
  async getEvents(req, res) {
    try {
      const snapshot = await db.collection('events')
        .orderBy('createdAt', 'desc')
        .get();

      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  // Add new event
  async addEvent(req, res) {
    try {
      const { title, time, description, img } = req.body;
      
      const docRef = await db.collection('events').add({
        title,
        time,
        description,
        img,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const newEvent = {
        id: docRef.id,
        title,
        time,
        description,
        img,
      };

      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ error: 'Failed to add event' });
    }
  },

  // Update event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, time, description, img } = req.body;

      await db.collection('events').doc(id).update({
        title,
        time,
        description,
        img,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  // Delete event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await db.collection('events').doc(id).delete();
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },
};

module.exports = eventController;