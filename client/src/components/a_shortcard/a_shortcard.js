import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Button from "../../../src/components/button/button";
import "./a_shortcard.css";

const { Meta } = Card;

const A_ShortCard = ({ title, description, imageSrc, buttonText, onEditClick, onDeleteClick }) => {
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
          text={buttonText || "Edit"}
          onClick={onEditClick}
          styleClass="btn-edit"
          icon={<EditOutlined />}
        />
          <Button
          text="Delete"
          onClick={onDeleteClick}
          styleClass="btn-delete"
          icon={<DeleteOutlined />}
        />
      </div>
    </Card>
  );
};

export default A_ShortCard;
