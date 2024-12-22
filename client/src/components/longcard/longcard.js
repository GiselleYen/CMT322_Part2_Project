import React from 'react';
import { Card, Typography} from 'antd';
import Button from '../../components/button/button';
import "./longcard.css";

const cardStyle = {
  width: 820,
  height: 300,
  overflow: 'hidden', // Ensure content does not overflow
};

const imgStyle = {
  display: 'block',
  width: 350,
  height: 300, // Set the same height for uniformity
  objectFit: 'cover', // Ensures the image scales proportionally without distortion
};

const LongCard = ({ 
  // achieverRank, 
  internName, 
  position, 
  quote, 
  img, 
  buttonText, 
  onButtonClick, // Pass the onClick function directly
}) => (
  <Card
    hoverable
    style={{
      ...cardStyle,
      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
    }}
    styles={{
      body: {
        padding: 0,
      },
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <img
        alt="avatar"
        src={img}
        style={imgStyle}
      />
      <div className="longcard-content">
        <Typography.Title className="longcard-name">{internName}</Typography.Title>
        <Typography.Text className="longcard-position">{position}</Typography.Text>
        <Typography.Text className="longcard-quote">{quote}</Typography.Text>
        <div className="btn-lccontainer">
          <Button
            text={buttonText}
            onClick={onButtonClick} // Use the passed onClick handler
            styleClass="btn-longcard"
          />
        </div>
      </div>
    </div>
  </Card>
);

export default LongCard;
