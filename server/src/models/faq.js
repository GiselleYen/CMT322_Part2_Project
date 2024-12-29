const { db, admin } = require('../config/firebase');

class FAQ {
  constructor() {
    this.collection = db.collection('faqs');
  }

  async getAll() {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async add(faq) {
    const faqData = {
      ...faq,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the FAQ to Firestore
    const docRef = await this.collection.add(faqData);

    // Return the full FAQ object, including the Firestore doc ID
    return {
      id: docRef.id,
      question: faq.question,
      answer: faq.answer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(id, updatedFAQ) {
    const faqData = {
      ...updatedFAQ,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await this.collection.doc(id).set(faqData, { merge: true });
  }

  async delete(id) {
    await this.collection.doc(id).delete();
  }
}

module.exports = new FAQ();
