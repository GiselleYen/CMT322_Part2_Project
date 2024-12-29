const { db, admin } = require('../config/firebase');

class Announcement {
  constructor() {
    this.collection = db.collection('announcements');
    this.defaultAnnouncements = [
      { title: "", description: "", bgImage: "/assets/images/Announcement_A.png", color: "var(--primary-color)" },
      { title: "", description: "", bgImage: "/assets/images/Announcement_B.png", color: "var(--secondary-color)" },
      { title: "", description: "", bgImage: "/assets/images/Announcement_C.png", color: "var(--primary-color)" },
    ];
  }

  async getAll() {
    const snapshot = await this.collection
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();

    const fetchedAnnouncements = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      bgImage: this.defaultAnnouncements[index].bgImage,
      color: this.defaultAnnouncements[index].color,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));

    return fetchedAnnouncements.concat(
      this.defaultAnnouncements.slice(fetchedAnnouncements.length)
    );
  }

  async getExisting() {
    const snapshot = await this.collection
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();

    const existingAnnouncements = {};
    snapshot.forEach(doc => {
      existingAnnouncements[doc.id] = doc;
    });

    return {
      announcements: existingAnnouncements,
      snapshot: snapshot
    };
  }

  createAnnouncementDoc(announcement, index) {
    return {
      title: announcement.title,
      description: announcement.description,
      bgImage: `/assets/images/Announcement_${String.fromCharCode(65 + index)}.png`,
      color: index % 2 === 0 ? "var(--primary-color)" : "var(--secondary-color)",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: announcement.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    };
  }

  async batchUpdate(announcements) {
    const batch = db.batch();
    const { announcements: existingAnnouncements, snapshot: existingSnapshot } = await this.getExisting();

    // Process each announcement
    announcements.forEach((announcement, index) => {
      let docRef;

      if (announcement.id && existingAnnouncements[announcement.id]) {
        docRef = this.collection.doc(announcement.id);
      } else if (existingSnapshot.docs[index]) {
        docRef = existingSnapshot.docs[index].ref;
      } else {
        docRef = this.collection.doc();
      }

      batch.set(
        docRef,
        this.createAnnouncementDoc(announcement, index),
        { merge: true }
      );
    });

    // Handle deletions
    if (existingSnapshot.size > announcements.length) {
      const extraDocs = existingSnapshot.docs.slice(announcements.length);
      extraDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }

    await batch.commit();
  }
}

module.exports = new Announcement();