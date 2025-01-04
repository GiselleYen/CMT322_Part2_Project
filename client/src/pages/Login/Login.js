import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from '../../components/button/button';
import { message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import InputField from '../../components/inputfield/inputfield';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { authService } from '../../services/authService'; // Import session management service

const LoginPage = ({ setIsLoggedIn, setRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Get ID token and calculate session expiration (30 minutes)
      const idToken = await user.getIdToken();
      const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes in milliseconds
  
      // Determine user role based on email
      const role = user.email === 'cssociety@student.usm.my' ? 'admin' : 'student';
  
      // Store session data locally
      authService.setSession(role, idToken, expiryTime);
  
      // Update state in parent component
      setIsLoggedIn(true);
      setRole(role);
  
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (email.endsWith('@student.usm.my')) {
        navigate('/userhome');
      } else {
        throw new Error('Invalid email domain. Please use your student email.');
      }
    } catch (error) {
      // Set a generic error message and display it to the user
      setError('Login failed. Please reenter your email and password.');
      console.error('Login error:', error);
      message.error('Login failed. Please reenter your email and password.');
    }
  };

  const handleForgotPswdRedirect = () => {
    navigate('/forgot-pswd');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className='event-info-container'>
        <h1>Virtual Computer Science Internship and Recruitment Fair (VCSIRF)</h1>
        <h2>— Find your internship opportunities in here!</h2>
        <h4>Date: 4th January 2025</h4>
        <h4>Time: 8:45 AM - 4:30 PM (GMT+8)</h4>
        <h4>Venue: Online</h4>
      </div>

      <div className="login-container">
        <h2>Login</h2>
        <p>Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="@student.usm.my"
            required
            prefixIcon={<UserOutlined />}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="none"
            required
            prefixIcon={<LockOutlined />}
          />

          <p className="forgot-pswd" onClick={handleForgotPswdRedirect}>
            Forgot Password?
          </p>
          <Button text="Login" type="submit" styleClass="login-btn" />
        </form>

        <p className="register-link">
          New to VCSIRF? {' '}
          <span onClick={handleRegisterRedirect}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
