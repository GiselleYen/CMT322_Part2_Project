import React from "react";
import { Card } from "antd";
import Button from "../../../src/components/button/button";
import "./shortcard.css";

const { Meta } = Card;

const ShortCard = ({ title, description, imageSrc, buttonText, onButtonClick }) => {
  return (
    <Card
      hoverable
      className="shortcard"
      style={{ transform: 'none' }}
      cover={
        <img
          alt={title}
          src={imageSrc}
          className="shortcard-image" // Apply consistent image styling
        />
      }
    >
      <div className="shortcard-content">
        <Meta
          title={<div className="shortcard-title">{title}</div>}
          description={<div className="shortcard-description">{description}</div>}
        />
      </div>
      <div className="shortcard-button-container">
        <Button
          text={buttonText || "Learn More"}
          onClick={onButtonClick}
          styleClass="btn-card"
        />
      </div>
    </Card>
  );
};

export default ShortCard;
