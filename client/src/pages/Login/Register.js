import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Button from '../../components/button/button';
import { Select, message} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import RegisterInputField from '../../components/inputfield/registerinputfield';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    matricNumber: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Successfully");

    if (!name || !matricNumber  || !email || !password || !confirmPassword) {
      message.error('Please fill in all fields');
      return;
    }

    // if (password !== confirmPassword) {
    //   message.error('Passwords do not match');
    //   return;
    // }

    message.success('Registration successful!');
    setTimeout(() => {
      navigate('/'); 
    }, 2000);
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className='register-header'>
        <h1>Registration Form</h1>
        <h2>Create your account for VCSIRF</h2>
        <p>- Join us and dive into a world of career opportunities!</p>
        <p>Dont's miss out on valuable insights, inspiration, and chances to shape your career! -</p>
      </div>

      <div className="register-container">

        <form onSubmit={handleSubmit} className="register-form">
          <RegisterInputField
            label="Name"
            type="text"
            name="participant_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            prefixIcon={<UserOutlined />}
          />
          <RegisterInputField
            label="Matric Number"
            type="text"
            name="matricNumber"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            placeholder="Enter your matric number"
            required
            prefixIcon={<IdcardOutlined />}
          />
          <div className="register-input-label">Year of Study</div>
          <Select
            className="study-year"
            showSearch
            placeholder="Select your Year of Study"
            optionFilterProp="label"
            prefix={<CalendarOutlined style={{ fontSize: '16px', marginRight: '2px', marginTop: '22px' }} />} 
            options={[
            {
                value: 'Year 1',
                label: 'Year 1',
            },
            {
                value: 'Year 2',
                label: 'Year 2',
            },
            {
                value: 'Year 3',
                label: 'Year 3',
            },
            {
                value: 'Year 4',
                label: 'Year 4',
            },
            ]}
        />
          <RegisterInputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="@student.usm.my"
            required
            prefixIcon={<MailOutlined />}
          />
          <RegisterInputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            prefixIcon={<LockOutlined />}
          />
          <RegisterInputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            prefixIcon={<LockOutlined />}
          />
          <Button text="Register" onClick={handleSubmit} styleClass="register-btn"/>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <span onClick={handleLoginRedirect} className="login-text">Login here</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
