import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgot-pswd.css'; 
import Button from '../../components/button/button';
import { message } from 'antd';
import InputField from '../../components/inputfield/inputfield';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock email validation logic (for demonstration purposes)
    if (email.endsWith('student.usm.my')  || email === 'cssociety.student.usm.my') {
      // Simulate password reset process
      message.success('A password reset link has been sent to your email.');
      // Optionally, you can trigger an actual email service here
    } else {
      // Set error message if the email is not recognized
      message.error('This email is not registered. Please enter a valid email.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Enter your email address to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            prefix="none"
          />
          <Button
            text="Send Reset Link"
            onClick={handleSubmit}
            styleClass="reset-btn"
          />
        </form>

        <p className="back-to-login-link">
          Remember your password?{' '}
          <span onClick={handleBackToLogin}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
