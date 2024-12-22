import React from 'react';
import { Input } from 'antd';
import "./registerinputfield.css";

const RegisterInputField = ({ label, type, value, onChange, placeholder, required, prefixIcon }) => {
  return (
    <div className="register-input-container">
      <div className="register-input-label">{label}</div>
      <Input
        className="register-input"
        type={type}
        size="large"
        placeholder={placeholder === 'none'? null:placeholder} 
        value={value}
        onChange={onChange}
        required={required}
        prefix={prefixIcon === 'none' ? null : prefixIcon} 
      />
    </div>
  );
};

export default RegisterInputField;