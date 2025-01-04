const { db, admin } = require('../config/firebase');

class BestIntern {
  static collectionName = 'bestInterns';

  // Fetch all best interns
  static async findAll() {
    try {
      const snapshot = await db.collection(this.collectionName)
      .orderBy("achieverRank", "asc")
      .get();

      console.log('Fetched snapshot:', snapshot);
      console.log('Fetched docs:', snapshot.docs);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      throw new Error('Failed to fetch best interns: ' + error.message);
    }
  }

  // Update an existing best intern
  static async update(id, bestInternData) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Best intern not found');
      }

      const updatedBestIntern = {
        ...bestInternData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await docRef.update(updatedBestIntern);
      return {
        id,
        ...updatedBestIntern,
      };
    } catch (error) {
      throw new Error('Failed to update best intern: ' + error.message);
    }
  }

  // Bulk update best interns
  static async bulkUpdate(bestInterns) {
    try {
      const batch = db.batch();
      const existingBestInternsSnapshot = await db.collection(this.collectionName).get();

      // Create a map of existing best interns
      const existingBestInterns = {};
      existingBestInternsSnapshot.forEach(doc => {
        existingBestInterns[doc.id] = doc;
      });

      // Process each best intern
      bestInterns.forEach(bestIntern => {
        let docRef;

        if (bestIntern.id && existingBestInterns[bestIntern.id]) {
          // If best intern has an ID and exists, update it
          docRef = db.collection(this.collectionName).doc(bestIntern.id);
        } else {
          // If no existing document or no ID, create a new one
          docRef = db.collection(this.collectionName).doc();
        }

        batch.set(
          docRef,
          {
            ...bestIntern,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: bestIntern.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw new Error('Failed to bulk update best interns: ' + error.message);
    }
  }
}

module.exports = BestIntern;
