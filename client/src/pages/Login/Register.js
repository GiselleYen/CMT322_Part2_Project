import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, CalendarOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { getAuth } from 'firebase/auth';
import Button from '../../components/button/button';
import RegisterInputField from '../../components/inputfield/registerinputfield';
import './Register.css';

// Configure the message duration globally
message.config({
  duration: 5, // Set the duration globally to 5 seconds
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    matricNumber: '',
    yearOfStudy: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  // State to toggle confirm password visibility

  const validateForm = () => {
    const { name, matricNumber, yearOfStudy, email, password, confirmPassword } = formData;
    
    if (!name || !matricNumber || !yearOfStudy || !email || !password || !confirmPassword) {
      message.error('Please fill in all fields');
      return false;
    }

    if (!email.endsWith('@student.usm.my')) {
      message.error('Please use a valid @student.usm.my email');
      return false;
    }

    // if (password.length < 6) {
    //   message.error('Password must be at least 6 characters long');
    //   return false;
    // }

    // Password complexity check: at least 12 characters, contains at least one uppercase, one lowercase, and one special character
    //^(?=.*[a-z]) ensures at least one lowercase letter.
    //(?=.*[A-Z]) ensures at least one uppercase letter.
    //(?=.*[!@#$%^&*(),.?":{}|<>]) ensures at least one special character.
    //.{12,}$ ensures the password is at least 12 characters long.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;
    if (!passwordRegex.test(password)) {
      message.error('Password must be at least 12 characters long and include a combination of at least one uppercase letter, one lowercase letter, and one special character (e.g. @, &, $ and etc.).', 6);
      return false;
    }

    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {

      // Call your backend API to store user data
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          matricNumber: formData.matricNumber,
          yearOfStudy: formData.yearOfStudy,
          email: formData.email,
          password: formData.password
        })
      });
      
      // Parse the response to get the error message if any
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register user');
      }

      message.success('Registration successful!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle the specific matric number error
      if (error.message === 'Matric number already registered') {
        message.error('This matric number is already registered. Please use a different one.');
      }
      // Handle email already in use error
      else if (error.code === 'auth/email-already-in-use') {
        message.error('This email is already registered.');
      }
      // Handle other errors
      else {
        message.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className='register-header'>
        <h1>Registration Form</h1>
        <h2>Create your account for VCSIRF</h2>
        <p>- Join us and dive into a world of career opportunities!</p>
        <p>Don't miss out on valuable insights, inspiration, and chances to shape your career! -</p>
      </div>

      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <RegisterInputField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            required
            prefixIcon={<UserOutlined />}
          />
          
          <RegisterInputField
            label="Matric Number"
            type="text"
            name="matricNumber"
            value={formData.matricNumber}
            onChange={(e) => handleChange('matricNumber', e.target.value)}
            placeholder="Enter your matric number"
            required
            prefixIcon={<IdcardOutlined />}
          />
          
          <div className="register-input-label">Year of Study</div>
          <Select
            className="study-year"
            value={formData.yearOfStudy}
            onChange={(value) => handleChange('yearOfStudy', value)}
            showSearch
            placeholder="Select your Year of Study"
            optionFilterProp="label"
            prefix={<CalendarOutlined />}
            options={[
              { value: 'Year 1', label: 'Year 1' },
              { value: 'Year 2', label: 'Year 2' },
              { value: 'Year 3', label: 'Year 3' },
              { value: 'Year 4', label: 'Year 4' },
            ]}
          />
          
          <RegisterInputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="@student.usm.my"
            required
            prefixIcon={<MailOutlined />}
          />
          
          <div className="password-field">
            <RegisterInputField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter your password"
              required
              prefixIcon={<LockOutlined />}
            />
            <span
              className="password-eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          
          <div className="password-field">
            <RegisterInputField
              label="Confirm Password"
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
              prefixIcon={<LockOutlined />}
            />
            <span
              className="password-eye-icon"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          
          <Button 
            text={loading ? "Registering..." : "Register"} 
            onClick={handleSubmit} 
            styleClass="register-btn"
            disabled={loading}
          />
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/')} className="login-text">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;