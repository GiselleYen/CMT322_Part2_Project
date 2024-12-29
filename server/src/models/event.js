const { db, admin } = require('../config/firebase');

class Event {
  static collectionName = 'events';

  static async findAll() {
    try {
      const snapshot = await db.collection(this.collectionName)
        .orderBy('time', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      throw new Error('Failed to fetch events: ' + error.message);
    }
  }

  static async create(eventData) {
    try {
      const docRef = db.collection(this.collectionName).doc();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      
      const newEvent = {
        ...eventData,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await docRef.set(newEvent);
      return {
        id: docRef.id,
        ...newEvent,
      };
    } catch (error) {
      throw new Error('Failed to create event: ' + error.message);
    }
  }

  static async update(id, eventData) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Event not found');
      }

      const updatedEvent = {
        ...eventData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await docRef.update(updatedEvent);
      return {
        id,
        ...updatedEvent,
      };
    } catch (error) {
      throw new Error('Failed to update event: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Event not found');
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw new Error('Failed to delete event: ' + error.message);
    }
  }

  static async bulkUpdate(events) {
    try {
      const batch = db.batch();
      const existingEventsSnapshot = await db.collection(this.collectionName).get();
      
      // Create a map of existing events
      const existingEvents = {};
      existingEventsSnapshot.forEach(doc => {
        existingEvents[doc.id] = doc;
      });

      // Process each event
      events.forEach(event => {
        let docRef;

        if (event.id && existingEvents[event.id]) {
          // If event has an ID and exists, update it
          docRef = db.collection(this.collectionName).doc(event.id);
        } else {
          // If no existing document or no ID, create a new one
          docRef = db.collection(this.collectionName).doc();
        }

        batch.set(
          docRef,
          {
            ...event,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: event.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw new Error('Failed to bulk update events: ' + error.message);
    }
  }
}

module.exports = Event;