const { db, admin } = require('../config/firebase');

class VenueDateTime {
  static defaultData = {
    date: '4th January 2025',
    time: '8:45 AM - 4:30 PM (GMT+8)',
    venue: 'Online',
    webexLink: 'https://meet1423.webex.com/wbxmjs/joinservice/sites/meet1423/meeting/download/c44e3b9554904d57936b51678ea3c6f8?siteurl=meet1423&MTID=m905c71cb000dec77dc3a62d640e1d1ea'
  };

  static collection = db.collection('venueDateTime');

  static async findLatest() {
    try {
      const snapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return { ...this.defaultData };
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    } catch (error) {
      throw new Error('Error fetching venue datetime: ' + error.message);
    }
  }

  static async updateOrCreate(venueData) {
    try {
      const batch = db.batch();
      
      // Get existing venue data
      const existingSnapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      let docRef;
      if (!existingSnapshot.empty) {
        docRef = existingSnapshot.docs[0].ref;
      } else {
        docRef = this.collection.doc();
      }

      const updatedData = {
        date: venueData.date,
        time: venueData.time,
        venue: venueData.venue,
        webexLink: venueData.webexLink,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: venueData.createdAt || admin.firestore.FieldValue.serverTimestamp()
      };

      batch.set(docRef, updatedData, { merge: true });
      await batch.commit();

      return {
        id: docRef.id,
        ...updatedData
      };
    } catch (error) {
      throw new Error('Error updating venue datetime: ' + error.message);
    }
  }

  static async validateData(data) {
    const requiredFields = ['date', 'time', 'venue', 'webexLink'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  }
}

module.exports = VenueDateTime;