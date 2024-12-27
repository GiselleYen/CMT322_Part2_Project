const { db, admin } = require('../config/firebase');

const announcementController = {
  async getAnnouncements(req, res) {
    try {
      const snapshot = await db.collection('announcements')
        .orderBy('createdAt', 'desc')
        .limit(3) // Limit to 3 announcements
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

      // Pad with defaults if fewer than 3 announcements
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

      announcements.forEach((announcement, index) => {
        const docRef = announcement.id
          ? db.collection('announcements').doc(announcement.id)
          : db.collection('announcements').doc();

        console.log("ID: ", announcement.id);

        batch.set(
          docRef,
          {
            title: announcement.title,
            description: announcement.description,
            bgImage: `/assets/images/Announcement_${String.fromCharCode(65 + index)}.png`, // Fixed bgImage A, B, C
            color: index % 2 === 0 ? "var(--primary-color)" : "var(--secondary-color)", // Alternate colors
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: announcement.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      res.json({ message: 'Announcements updated successfully' });
    } catch (error) {
      console.error('Error updating announcements:', error);
      res.status(500).json({ error: 'Failed to update announcements' });
    }
  },
};

module.exports = announcementController;
