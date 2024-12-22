import React from 'react';
import { Button } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons'; 
import './manageButton.css';

const ManageButton = ({ text, onClick, type = 'primary', className = '', icon = <PlusOutlined /> }) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      icon={icon} 
      className={`manage_button ${className}`}
    >
      {text}
    </Button>
  );
};

export default ManageButton;
