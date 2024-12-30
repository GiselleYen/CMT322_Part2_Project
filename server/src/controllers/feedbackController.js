const feedbackModel = require('../models/feedback');

// Submit Feedback
const submitFeedback = async (req, res) => {
  const { feedback } = req.body;
  const email = req.user.email; // Extract email from the decoded token

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback is required' });
  }

  try {
    const feedbackEntry = {
      email,
      feedback,
      date: new Date(),
    };

    // Save feedback to your database (mocked here for simplicity)
    console.log('Feedback saved:', feedbackEntry);

    // Respond with success
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Get all feedbacks
const getAllFeedback = async (req, res) => {
  try {
    const feedbackSnapshot = await db.collection("feedback").get();
    const feedback = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks." });
  }
};

// Update feedback status
const updateFeedbackStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Done", "Not Done"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const feedbackRef = db.collection("feedback").doc(id);
    await feedbackRef.update({ status });
    res.status(200).json({ message: "Feedback status updated successfully." });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    res.status(500).json({ message: "Failed to update feedback status." });
  }
};

// Export the functions
module.exports = {
  submitFeedback,
  getAllFeedback, 
  updateFeedbackStatus,
};
