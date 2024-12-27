import React, { useState, useEffect } from "react";
import { Carousel, Modal, Button, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./A_Announcement.css";

import { getAuth } from "firebase/auth"

const A_Announcement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { title: "", description: "", bgImage: "/assets/images/Announcement_A.png", color: "var(--primary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_B.png", color: "var(--secondary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_C.png", color: "var(--primary-color)" },
  ]);

  // Fetch announcements from the backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/announcements`) 
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements((prev) =>
          prev.map((announcement, index) => ({
            ...announcement,
            title: data[index]?.title || announcement.title,
            description: data[index]?.description || announcement.description,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
        message.error("Failed to load announcements.");
      });
  }, []);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleInputChange = (index, field, value) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index][field] = value;
    setAnnouncements(updatedAnnouncements);
  };

  const handleSaveChanges = async () => {
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      message.error("User not authenticated");
      return;
    }
  
    try {
      const token = await user.getIdToken();
  
      // Validate all fields are filled in
      const isValid = announcements.every(
        (announcement) => announcement.title.trim() !== "" && announcement.description.trim() !== ""
      );
  
      if (!isValid) {
        message.error("Please fill in all title and description fields.");
        return;
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token here
        },
        body: JSON.stringify({ announcements }),
      });
  
      if (response.ok) {
        message.success("Announcements updated successfully");
        setIsModalVisible(false); // Close modal on success
      } else {
        throw new Error("Failed to update announcements");
      }
    } catch (error) {
      console.error("Error updating announcements:", error);
      message.error("Failed to update announcements.");
    }
  };

  return (
    <div>
      <div className="admin-home_container">
        <div className="admin-home_announcement">Latest Announcement</div>
        <Carousel autoplay dotPosition="right" infinite={true} style={{ height: "400px", marginBottom: "20px" }}>
          {announcements.map((announcement, index) => (
            <div key={index}>
              <div
                className="carousel-slide bg-image"
                style={{ backgroundImage: `url(${announcement.bgImage})`, color: announcement.color }}
              >
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
        <Button type="primary" onClick={handleOpenModal} icon={<PlusOutlined />} className="manage_button">
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
          <Button key="close" className="cancel_button" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="save" className="save_button" onClick={handleSaveChanges}>
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

export default A_Announcement;
