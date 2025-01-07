const { db, admin } = require('../config/firebase');

class Company {
  static collectionName = 'Company';  // Static property to store the name of the Firestore collection

  static async findAll() { // Method to retrieve all companies from Firestore
    try {
      const snapshot = await db.collection(this.collectionName) // Query to fetch all companies ordered by their name in ascending order
        .orderBy('name', 'asc')
        .get();

      return snapshot.docs.map(doc => ({ // Return the documents in a formatted array with added createdAt and updatedAt properties
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {  // Error handling if fetching fails
      throw new Error('Failed to fetch companys: ' + error.message);
    }
  }
// Method to create a new company in the database
  static async create(companyData) {
    try { 
      const docRef = db.collection(this.collectionName).doc(); // Create a new document reference and generate a timestamp
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      // Prepare the new company data including timestamps
      const newCompany = {
        ...companyData,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
// Set the new company data in Firestore
      await docRef.set(newCompany);
      return {
        id: docRef.id,  // Return the document ID and the company data
        ...newCompany,
      };
    } catch (error) {
      throw new Error('Failed to create company: ' + error.message);
    }
  }
 // Method to update an existing company
  static async update(id, companyData) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) { // Check if the company exists, throw an error if not
        throw new Error('Company not found');
      }
// Prepare updated company data with the new updatedAt timestamp
      const updatedCompany = {
        ...companyData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
 // Update the company in Firestore
      await docRef.update(updatedCompany);
      return {
        id,
        ...updatedCompany,
      };
    } catch (error) {
      throw new Error('Failed to update company: ' + error.message);
    }
  }
 // Method to delete a company from the database
  static async delete(id) {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
// Check if the company exists, throw an error if not
      if (!doc.exists) {
        throw new Error('Company not found');
      }

      await docRef.delete(); // Delete the company from Firestore
      return true; // Return true if the deletion was successful
    } catch (error) {
      throw new Error('Failed to delete company: ' + error.message);
    }
  }

}
// Export the Company class to be used in other parts of the application
module.exports = Company;