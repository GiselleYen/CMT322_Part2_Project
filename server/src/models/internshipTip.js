const { db, admin } = require('../config/firebase');

class InternshipTip {
  static collectionName = 'internshipTips';

  static async findAll() {
    try {
      const snapshot = await db.collection(this.collectionName)
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
      throw new Error('Failed to fetch internship tips: ' + error.message);
    }
  }

  static async create(internshipTipData) {
    try {
      const docRef = db.collection(this.collectionName).doc();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      const newInternshipTip = {
        ...internshipTipData,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await docRef.set(newInternshipTip);
      return {
        id: docRef.id,
        ...newInternshipTip,
      };
    } catch (error) {
      throw new Error('Failed to create internship tip: ' + error.message);
    }
  }

  static async update(id, internshipTipData) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Internship tip not found');
      }

      const updatedInternshipTip = {
        ...internshipTipData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await docRef.update(updatedInternshipTip);
      return {
        id,
        ...updatedInternshipTip,
      };
    } catch (error) {
      throw new Error('Failed to update internship tip: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Internship tip not found');
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw new Error('Failed to delete internship tip: ' + error.message);
    }
  }

  static async bulkUpdate(internshipTips) {
    try {
      const batch = db.batch();
      const existingInternshipTipsSnapshot = await db.collection(this.collectionName).get();

      // Create a map of existing internship tips
      const existingInternshipTips = {};
      existingInternshipTipsSnapshot.forEach(doc => {
        existingInternshipTips[doc.id] = doc;
      });

      // Process each internship tip
      internshipTips.forEach(internshipTip => {
        let docRef;

        if (internshipTip.id && existingInternshipTips[internshipTip.id]) {
          // If internship tip has an ID and exists, update it
          docRef = db.collection(this.collectionName).doc(internshipTip.id);
        } else {
          // If no existing document or no ID, create a new one
          docRef = db.collection(this.collectionName).doc();
        }

        batch.set(
          docRef,
          {
            ...internshipTip,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: internshipTip.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw new Error('Failed to bulk update internship tips: ' + error.message);
    }
  }
}

module.exports = InternshipTip;
