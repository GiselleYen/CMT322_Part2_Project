// feedbackController.js
const feedbackModel = require('../models/feedback');

// Submit Feedback
const submitFeedback = async (req, res) => {
  const { feedback } = req.body;
  const email = req.user.email;  // Extract email from the decoded token

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

// Get All Feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await feedbackModel.getAllFeedback();
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Feedback Status
const updateFeedbackStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await feedbackModel.updateFeedbackStatus(id, status);
    res.status(200).json({ message: 'Feedback status updated successfully!', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the functions
module.exports = {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus
};
