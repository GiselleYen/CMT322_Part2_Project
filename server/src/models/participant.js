const admin = require('firebase-admin');
const db = admin.firestore();

class Participant {
  constructor() {
    this.collection = db.collection('users');
  }

  async getAllParticipants() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: new Date(doc.data().createdAt).toLocaleDateString()
    }));
  }

  async getStatistics() {
    const snapshot = await this.collection.get();
    const participants = snapshot.docs.map(doc => doc.data());

    const totalParticipants = participants.length;

    const recentParticipants = participants.filter(participant => {
      const registrationDate = new Date(participant.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return registrationDate >= sevenDaysAgo;
    }).length;

    return {
      totalParticipants,
      recentParticipants,
    };
  }
}

module.exports = new Participant();
