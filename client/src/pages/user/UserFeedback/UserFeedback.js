import React, { useState } from 'react';
import './UserFeedback.css'; 
import Button from '../../../components/button/button';
import { message, Input } from 'antd';
import { submitFeedback } from '../../../services/Feedback/feedbackService'; 
const { TextArea } = Input;

const UserFeedbackPage = () => {
  const [feedback, setFeedback] = useState('');

  // Function to submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) {
      message.error('Please provide feedback.');
      return;
    }

    try {
      await submitFeedback(feedback); // Call the service function
      setFeedback(''); // Reset feedback on successful submission
    } catch (error) {
      console.error('Failed to submit feedback:', error);
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
        <p>We are glad and honest to any inquiries, feedback and comment.</p>

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

          <Button text="Submit" onClick={handleSubmit} styleClass="submit-btn" />
        </form>
      </div>
    </div>
  );
};

export default UserFeedbackPage;
