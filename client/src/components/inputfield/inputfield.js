import React from 'react';
import { Input } from 'antd';
import "./inputfield.css";

const InputField = ({ label, type, value, onChange, placeholder, required, prefixIcon }) => {
  return (
    <div className="input-container">
      <div className="input-label">{label}</div>
      <Input
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

export default InputField;