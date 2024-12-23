import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import Button from '../../components/button/button';
import RegisterInputField from '../../components/inputfield/registerinputfield';
import './Register.css';

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

    if (password.length < 6) {
      message.error('Password must be at least 6 characters long');
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
      const auth = getAuth();
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        matricNumber: formData.matricNumber,
        yearOfStudy: formData.yearOfStudy,
        email: formData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Call your backend API to store user data
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
        },
        body: JSON.stringify({
          name: formData.name,
          matricNumber: formData.matricNumber,
          yearOfStudy: formData.yearOfStudy,
          email: formData.email
        })
      });

      message.success('Registration successful!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      }
      
      message.error(errorMessage);
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
          
          <RegisterInputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            required
            prefixIcon={<LockOutlined />}
          />
          
          <RegisterInputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
            prefixIcon={<LockOutlined />}
          />
          
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