import React, { useState, useEffect } from "react";
import { Carousel, Modal, Button, Input, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import { auth } from '../../../config/firebase';
//import { getAuth } from "firebase/auth";
import { announcementService } from "../../../services/Dashboard/announcementService";
import "./A_Announcement.css";

const A_Announcement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { title: "", description: "", bgImage: "/assets/images/Announcement_A.png", color: "var(--primary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_B.png", color: "var(--secondary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_C.png", color: "var(--primary-color)" },
  ]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements((prev) =>
          prev.map((announcement, index) => ({
            ...announcement,
            title: data[index]?.title || announcement.title,
            description: data[index]?.description || announcement.description,
            id: data[index]?.id || null, // Preserve ID for updating
          }))
        );
      } catch (error) {
        console.error("Error fetching announcements:", error);
        message.error("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleInputChange = (index, field, value) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index][field] = value;
    setAnnouncements(updatedAnnouncements);
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    console.log("Current User:", user);

    if (!user) {
      message.error("User not authenticated");
      return;
    }

    // Validate all fields are filled
    const isValid = announcements.every(
      (announcement) => announcement.title.trim() !== "" && announcement.description.trim() !== ""
    );

    if (!isValid) {
      message.error("Please fill in all title and description fields.");
      return;
    }

    setSaving(true);
    try {
      const token = await user.getIdToken();
      await announcementService.updateAnnouncements(announcements, token);
      message.success("Announcements updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating announcements:", error);
      message.error("Failed to update announcements.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-home_container">
        <div className="admin-home_announcement">Latest Announcement</div>
        <Carousel 
          autoplay 
          dotPosition="right" 
          infinite={true} 
          style={{ height: "400px", marginBottom: "20px" }}
        >
          {announcements.map((announcement, index) => (
            <div key={index}>
              <div
                className="carousel-slide bg-image"
                style={{ 
                  backgroundImage: `url(${announcement.bgImage})`, 
                  color: announcement.color 
                }}
              >
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
        <Button 
          type="primary" 
          onClick={handleOpenModal} 
          icon={<PlusOutlined />} 
          className="manage_button"
        >
          Manage Announcements
        </Button>
      </div>

      <Modal
        className="A_Announcement-modal"
        title={<div className="modal-title">Manage Announcements</div>}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        width={800}
        style={{ top: 50 }}
        footer={[
          <Button 
            key="close" 
            className="cancel_button" 
            onClick={handleCloseModal}
            disabled={saving}
          >
            Cancel
          </Button>,
          <Button 
            key="save" 
            className="save_button" 
            onClick={handleSaveChanges}
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>,
        ]}
      >
        <div>
          {announcements.map((announcement, index) => (
            <div key={index} style={{ marginBottom: "30px", backgroundColor: "#efeff8" }}>
              <h4 className="announcement-title">Announcement {index + 1}</h4>
              <Input
                placeholder="Title"
                value={announcement.title}
                onChange={(e) => handleInputChange(index, "title", e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input.TextArea
                placeholder="Description"
                value={announcement.description}
                onChange={(e) => handleInputChange(index, "description", e.target.value)}
                rows={3}
                required
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

A_Announcement.propTypes = {
  initialAnnouncements: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      bgImage: PropTypes.string,
      color: PropTypes.string,
      id: PropTypes.string,
    })
  ),
};

export default A_Announcement;