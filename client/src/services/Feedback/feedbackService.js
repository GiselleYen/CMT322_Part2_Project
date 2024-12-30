// src/services/feedbackService.js
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { message } from "antd"; // Import Ant Design notification system
import { auth, db } from "../../config/firebase"; // Ensure correct path to Firebase config

export const submitFeedback = async (feedbackText) => {
  const user = auth.currentUser;

  if (!user) {
    message.error('You must be logged in to submit feedback.');
    return;
  }

  const feedbackData = {
    email: user.email,
    feedback: feedbackText,
    submissionDateTime: new Date(),
    status: 'pending',
  };

  try {
    // Reference the collection and add the document
    await addDoc(collection(db, "feedback"), feedbackData);
    message.success('Feedback submitted successfully!');
  } catch (error) {
    message.error('Failed to submit feedback: ' + error.message);
  }
};
