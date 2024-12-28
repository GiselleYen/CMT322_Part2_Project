const { db, admin } = require('../config/firebase');

const venueDateTimeController = {
  async getVenueDateTime(req, res) {
    try {
      const snapshot = await db.collection('venueDateTime')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      const defaultVenueDateTime = {
        date: '4th January 2025',
        time: '8:45 AM - 4:30 PM (GMT+8)',
        venue: 'Online',
        webexLink: 'https://meet1423.webex.com/wbxmjs/joinservice/sites/meet1423/meeting/download/c44e3b9554904d57936b51678ea3c6f8?siteurl=meet1423&MTID=m905c71cb000dec77dc3a62d640e1d1ea'
      };

      if (snapshot.empty) {
        res.json(defaultVenueDateTime);
      } else {
        const venueData = snapshot.docs[0].data();
        res.json({
          id: snapshot.docs[0].id,
          ...venueData,
          createdAt: venueData.createdAt?.toDate(),
          updatedAt: venueData.updatedAt?.toDate()
        });
      }
    } catch (error) {
      console.error('Error fetching venue datetime:', error);
      res.status(500).json({ error: 'Failed to fetch venue datetime' });
    }
  },

  async updateVenueDateTime(req, res) {
    try {
      const venueData = req.body;
      const batch = db.batch();

      // Get existing venue data
      const existingSnapshot = await db.collection('venueDateTime')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      let docRef;
      if (!existingSnapshot.empty) {
        // Update existing document
        docRef = existingSnapshot.docs[0].ref;
      } else {
        // Create new document
        docRef = db.collection('venueDateTime').doc();
      }

      batch.set(docRef, {
        date: venueData.date,
        time: venueData.time,
        venue: venueData.venue,
        webexLink: venueData.webexLink,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: venueData.createdAt || admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      await batch.commit();
      res.json({ message: 'Venue datetime updated successfully' });
    } catch (error) {
      console.error('Error updating venue datetime:', error);
      res.status(500).json({ error: 'Failed to update venue datetime' });
    }
  }
};

module.exports = venueDateTimeController;