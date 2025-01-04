import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './forgot-pswd.css'; 
import Button from '../../components/button/button';
import { message } from 'antd';
import InputField from '../../components/inputfield/inputfield';
import { auth } from '../../config/firebase.js'; // Import Firebase auth
import { sendPasswordResetEmail} from 'firebase/auth'; // Import the function to send reset email
import { resetService } from "../../services/Reset/resetService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [emailList, setEmailList] = useState([]);

    useEffect(() => {
      fetchUsers();
    }, []);

     const fetchUsers = async () => {
          try {
            const data = await resetService.getUser();
            setEmailList(data);
          } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Failed to load users');
          }
        };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mock email validation logic (for demonstration purposes)
    if (email.endsWith('student.usm.my')  || email === 'cssociety.student.usm.my') {

      const isEmailRegistered = emailList.some((user) => user.email === email);

      if (isEmailRegistered) {
        try {
          // Send the password reset email
          await sendPasswordResetEmail(auth, email);
          message.success('A password reset link has been sent to your email.');
          navigate('/');
        } catch (error) {
          message.error('Error: ' + error.message);
        }
      } else {
        // If the email is not found in the email list
        message.error('This email is not registered. Please enter a valid email.');
      }
    } else if (email === '') {
      message.error('Email cannot be empty');
    } else {
      // Set error message if the email is not recognized
      message.error('This email is not a student email. Please enter a valid email.');
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
