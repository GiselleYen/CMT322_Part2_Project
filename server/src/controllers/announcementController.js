const { db, admin } = require('../config/firebase');

const announcementController = {
  async getAnnouncements(req, res) {
    try {
      const snapshot = await db.collection('announcements')
        .orderBy('createdAt', 'desc')
        .limit(3)
        .get();

      const defaultAnnouncements = [
        { title: "", description: "", bgImage: "/assets/images/Announcement_A.png", color: "var(--primary-color)" },
        { title: "", description: "", bgImage: "/assets/images/Announcement_B.png", color: "var(--secondary-color)" },
        { title: "", description: "", bgImage: "/assets/images/Announcement_C.png", color: "var(--primary-color)" },
      ];

      const fetchedAnnouncements = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        bgImage: defaultAnnouncements[index].bgImage,
        color: defaultAnnouncements[index].color,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      const announcements = fetchedAnnouncements.concat(
        defaultAnnouncements.slice(fetchedAnnouncements.length)
      );

      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  },

  async updateAnnouncements(req, res) {
    try {
      const { announcements } = req.body;
      const batch = db.batch();

      // First, get all existing announcements
      const existingAnnouncementsSnapshot = await db.collection('announcements')
        .orderBy('createdAt', 'desc')
        .limit(3)
        .get();

      // Create a map of existing announcements
      const existingAnnouncements = {};
      existingAnnouncementsSnapshot.forEach(doc => {
        existingAnnouncements[doc.id] = doc;
      });

      // Process each announcement
      announcements.forEach((announcement, index) => {
        let docRef;

        if (announcement.id && existingAnnouncements[announcement.id]) {
          // If announcement has an ID and exists, update it
          docRef = db.collection('announcements').doc(announcement.id);
        } else if (existingAnnouncementsSnapshot.docs[index]) {
          // If no ID but there's an existing document at this index, update that one
          docRef = existingAnnouncementsSnapshot.docs[index].ref;
        } else {
          // If no existing document, create a new one
          docRef = db.collection('announcements').doc();
        }

        batch.set(
          docRef,
          {
            title: announcement.title,
            description: announcement.description,
            bgImage: `/assets/images/Announcement_${String.fromCharCode(65 + index)}.png`,
            color: index % 2 === 0 ? "var(--primary-color)" : "var(--secondary-color)",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: announcement.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      // Delete any extra existing announcements beyond the current set
      if (existingAnnouncementsSnapshot.size > announcements.length) {
        const extraDocs = existingAnnouncementsSnapshot.docs.slice(announcements.length);
        extraDocs.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
      res.json({ message: 'Announcements updated successfully' });
    } catch (error) {
      console.error('Error updating announcements:', error);
      res.status(500).json({ error: 'Failed to update announcements' });
    }
  },
};

module.exports = announcementController;