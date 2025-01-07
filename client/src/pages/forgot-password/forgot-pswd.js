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
  const [email, setEmail] = useState(''); // State to manage the email input field
  const navigate = useNavigate(); // Hook to programmatically navigate between pages
  const [emailList, setEmailList] = useState([]); // State to store the list of registered emails fetched from the backend
// Fetch the list of registered users when the component mounts
    useEffect(() => {
      fetchUsers();
    }, []);
// Function to fetch the list of registered users from the backend
     const fetchUsers = async () => {
          try {
            const data = await resetService.getUser(); // Call the service to get the list of users
            setEmailList(data); // Store the fetched data in the state
          } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Failed to load users');
          }
        };
// Handle form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Mock email validation logic (for demonstration purposes)
    if (email.endsWith('student.usm.my')  || email === 'cssociety.student.usm.my') {
// Check if the entered email exists in the list of registered users
      const isEmailRegistered = emailList.some((user) => user.email === email);

      if (isEmailRegistered) {
        try {
          // Send the password reset email
          await sendPasswordResetEmail(auth, email);
          message.success('A password reset link has been sent to your email.');
          navigate('/'); // Navigate back to the login page
        } catch (error) {
          message.error('Error: ' + error.message);
        }
      } else {
        // If the email is not found in the email list
        message.error('This email is not registered. Please enter a valid email.');
      }
    } else if (email === '') { // Handle case where the email field is empty
      message.error('Email cannot be empty');
    } else {
      // Set error message if the email is not recognized
      message.error('This email is not a student email. Please enter a valid email.');
    }
  };
// Navigate back to the login page when the user clicks the Remember link
  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-page"> {/* Main container for the forgot password page */}
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Enter your email address to reset your password.</p>
{/* Form to handle the email input and submission */}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email} // Binds the email state to the input value
            onChange={(e) => setEmail(e.target.value)} // Updates the email state on user input
            placeholder="Enter your email"
            required
            prefix="none"
          /> {/* Button to trigger the password reset process */}
          <Button
            text="Send Reset Link"
            onClick={handleSubmit} // Handles the submission of the form
            styleClass="reset-btn"
          />
        </form>
 {/* Link to navigate back to the login page */}
        <p className="back-to-login-link">
          Remember your password?{' '}
          <span onClick={handleBackToLogin}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
