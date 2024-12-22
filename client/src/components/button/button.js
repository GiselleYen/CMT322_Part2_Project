import React from 'react';
import './button.css'; // Import button styling

const Button = ({ text, onClick, type = 'button', styleClass = '', icon = null }) => {
  return (
    <button
      className={`btn ${styleClass}`}
      onClick={onClick}
      type={type}
      // icon={icon}
    >
      {icon && <span className="icon">{icon}</span>} {/* Render icon if passed */}
      {text}
    </button>
  );
};

export default Button;
