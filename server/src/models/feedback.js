const db = require('../config/firebase');

// Submit Feedback
const submitFeedback = async (email, feedback) => {
  const newFeedback = {
    email,
    feedback,
    submissionDateTime: new Date(),
    status: 'Not Done',
  };

  try {
    const docRef = await db.collection('feedback').add(newFeedback);
    return { id: docRef.id, ...newFeedback };
  } catch (error) {
    throw new Error(`Failed to submit feedback: ${error.message}`);
  }
};

// Get All Feedback
const getAllFeedback = async () => {
  try {
    const feedbackSnapshot = await db.collection('feedback').get();
    return feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`);
  }
};

// Update Feedback Status
const updateFeedbackStatus = async (id, status) => {
  try {
    await db.collection('feedback').doc(id).update({ status });
    return { id, status };
  } catch (error) {
    throw new Error(`Failed to update feedback status: ${error.message}`);
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus,
};
