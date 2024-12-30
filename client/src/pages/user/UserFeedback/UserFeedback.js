import React, { useState } from 'react';
import './UserFeedback.css'; 
import Button from '../../../components/button/button';
import { message, Input, Spin } from 'antd';  // Importing Spin from Ant Design
import { submitFeedback } from '../../../services/Feedback/feedbackService'; 
const { TextArea } = Input;

const UserFeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Function to submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback) {
      message.error('Please provide feedback.');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      await submitFeedback(feedback); // Call the service function
      setFeedback(''); // Reset feedback on successful submission
      message.success('Feedback submitted successfully!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      message.error('Failed to submit feedback. Please try again later.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="feedback-page">
      <div className="info-container">
        <h1>Curious about something? Ask us!</h1>
        <h2>Share your feedback, or ask us anything!</h2>
        <h4>No question is too small</h4>
        <h4>—let us know what’s on your mind</h4>
      </div>

      <div className="feedback-container">
        <h2>Submit Your Feedback</h2>
        <p>We are glad and honest to any inquiries, feedback, and comment.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <TextArea
              className="custom-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your inquiries or feedback here..."
              autoSize={{ minRows: 7 }}
            />
          </div>

          <Button 
            text="Submit" 
            onClick={handleSubmit} 
            styleClass="submit-btn" 
            disabled={loading} // Disable button while loading
          />

          {/* Show the Spin component when submitting */}
          {loading && (
            <div className="loading-spinner">
              <Spin />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserFeedbackPage;
