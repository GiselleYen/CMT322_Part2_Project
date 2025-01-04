const { db } = require('../config/firebase');

class Reset {
  static collectionName = 'users';

  // Utility function to convert string dates to Date objects
  static convertToDate(date) {
    // If date is a valid string format, convert it to a Date object
    if (typeof date === 'string') {
      return new Date(date);
    }
    // If it's a Firestore Timestamp, use .toDate()
    if (date && date.toDate) {
      return date.toDate();
    }
    return null;  // Return null if the date is invalid or not available
  }

  static async findAll() {
    try {
      const snapshot = await db.collection(this.collectionName)
      .orderBy('name', 'asc')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: this.convertToDate(doc.data().createdAt), // Convert to Date
        updatedAt: this.convertToDate(doc.data().updatedAt), // Convert to Date
      }));
    } catch (error) {
      throw new Error('Failed to fetch users: ' + error.message);
    }
  }
}

module.exports = Reset;