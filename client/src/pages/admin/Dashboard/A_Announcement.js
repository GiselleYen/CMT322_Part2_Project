import React, { useState } from 'react';
import { Carousel, Modal, Button, Input, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import './A_Announcement.css';

const A_Announcement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      title: "A Announcement for Internship Application Deadlines",
      description:
        "Reminder: The deadline to apply for the summer internship program is fast approaching! Make sure to submit your applications by May 15th, 2024. Don't miss this opportunity to gain hands-on experience in your field of interest.",
      bgImage: "/assets/images/Announcement_A.png",
      color: "var(--primary-color)",
    },
    {
      title: "Unlocking Interview Success: Insights from Industry Experts",
      description: "Get industry insights in our expert panel session.",
      bgImage: "/assets/images/Announcement_B.png",
      color: "var(--secondary-color)",
    },
    {
      title: "Sharing Session: How to Optimize Your LinkedIn Profile",
      description: "Uncover the secrets of LinkedIn optimization",
      bgImage: "/assets/images/Announcement_C.png",
      color: "var(--primary-color)",
    },
  ]);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleInputChange = (index, field, value) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index][field] = value;
    setAnnouncements(updatedAnnouncements);
  };

  const handleSaveChanges = () => {
    // Validate that all titles and descriptions are filled in
    const isValid = announcements.every(
      (announcement) => announcement.title.trim() !== '' && announcement.description.trim() !== ''
    );

    if (!isValid) {
      // Show error message if any title or description is empty
      message.error('Please fill in all title and description fields.');
      return;
    }

    message.success('Announcements updated');
    console.log("Updated Announcements:", announcements);
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="admin-home_container">
        <div className="admin-home_announcement">Latest Announcement</div>
        <Carousel autoplay dotPosition="right" infinite={true} style={{ height: '400px', marginBottom: '20px' }} >
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
          <Button key="close" className='cancel_button' onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="save" className='save_button' onClick={handleSaveChanges}>
            Save
          </Button>,
        ]}
      >
        <div>
            {announcements.map((announcement, index) => (
            <div key={index} style={{ marginBottom: '30px', backgroundColor: "efeff8" }}> {/* Increased margin between items */}
                <h4 className="announcement-title">Announcement {index + 1}</h4>
                <Input
                placeholder="Title"
                value={announcement.title}
                onChange={(e) => handleInputChange(index, "title", e.target.value)}
                style={{ marginBottom: '10px' }}
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
