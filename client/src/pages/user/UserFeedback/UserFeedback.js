import React, { useState } from 'react';
import './UserFeedback.css'; 
import Button from '../../../components/button/button'
import { message, Input } from 'antd';
const { TextArea } = Input;

const UserFeedbackPage = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Simulate sending feedback to the server or API
    // Replace with actual API request if needed
    console.log('Feedback:', feedback);
    
    // Show success message
    message.success('Your feedback has been submitted successfully!');
    
    // Clear the form
    setFeedback('');
  };

  return (
    <div className="feedback-page">
      <div className='info-container'>
            <h1>Curious about something? Ask us!</h1>
            <h2>Share your feedback, or ask us anything!</h2>
            <h4>No question is too small</h4>
            <h4>  —let us know what’s on your mind</h4>
      </div>

      <div className="feedback-container">
        <h2>Submit Your Feedback</h2>
        <p>We are glad and honest to any inquiries, feedback and comment.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            {/* <div className="input-label">Feedback</div> */}
              <TextArea className="custom-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your inquiries or feedback here..."
                autoSize={{
                  minRows: 7,
                  
                }}
              />
          </div>

          <Button
            text="Submit"
            onClick={handleSubmit}
            styleClass="submit-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default UserFeedbackPage;
