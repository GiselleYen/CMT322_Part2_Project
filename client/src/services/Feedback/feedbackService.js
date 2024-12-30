import { collection, addDoc, updateDoc, doc, getDocs, Timestamp } from "firebase/firestore";
import { message } from "antd";
import { auth, db } from "../../config/firebase";

// Submit Feedback
export const submitFeedback = async (feedbackText) => {
  const user = auth.currentUser;

  if (!user) {
    message.error("You must be logged in to submit feedback.");
    return;
  }

  const feedbackData = {
    email: user.email,
    feedback: feedbackText,
    submissionDateTime: Timestamp.fromDate(new Date()),
    status: "Not Done",
  };

  try {
    await addDoc(collection(db, "feedback"), feedbackData);
    message.success("Feedback submitted successfully!");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    message.error("Failed to submit feedback: " + error.message);
  }
};

// Fetch All Feedbacks (Firestore)
export const getAllFeedbacks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const feedbacks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    message.error("Failed to fetch feedbacks: " + error.message);
    throw error;
  }
};

// Update Feedback Status (Firestore)
export const updateFeedbackStatus = async (id, status) => {
  try {
    const feedbackRef = doc(db, "feedback", id);
    await updateDoc(feedbackRef, { status });
    message.success("Feedback status updated successfully!");
  } catch (error) {
    console.error("Error updating feedback status:", error);
    message.error("Failed to update feedback status: " + error.message);
    throw error;
  }
};
