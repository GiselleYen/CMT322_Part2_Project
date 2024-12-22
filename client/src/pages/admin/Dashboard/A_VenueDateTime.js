import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import './A_VenueDateTime.css'; 

const A_VenueDateTime = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [eventDetails, setEventDetails] = useState({
    date: '4th January 2025',
    time: '8:45 AM - 4:30 PM (GMT+8)',
    venue: 'Online',
    webexLink: 'https://meet1423.webex.com/wbxmjs/joinservice/sites/meet1423/meeting/download/c44e3b9554904d57936b51678ea3c6f8?siteurl=meet1423&MTID=m905c71cb000dec77dc3a62d640e1d1ea',
  });

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(eventDetails);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setEventDetails(values);
      setIsModalVisible(false); 
    });
    message.success('Date, Time and Venue updated');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      {/* Venue and DateTime Section */}
      <div className="venue-banner" style={{ backgroundImage: 'url(/assets/images/DT_bg.png)'}}>
        <div className="venue-banner-content">

          <div className="event-header">
            <h2 className="event-title">VCSIRF Date and Venue</h2>
            <Button type="primary" className="manage-event-button" icon={<PlusOutlined />} onClick={showModal}>
                Manage Venue and DateTime
            </Button>
          </div>
          <div className="event-info">
            <div className="event-date">
              <strong>Date:</strong> {eventDetails.date}
            </div>
            <div className="event-time">
              <strong>Time:</strong> {eventDetails.time}
            </div>
            <div className="event-venue">
              <strong>Venue:</strong> {eventDetails.venue}
            </div>
            <div className="event-link">
              <a href={eventDetails.webexLink} target="_blank" rel="noopener noreferrer">
                <button className="join-button">Join on Webex</button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="A_VenueDateTime-modal"
        title={<div className="modal-title" >Manage Event</div>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        width={600}
        okButtonProps={{ className: 'save_button' }}
        cancelButtonProps={{ className: 'cancel_button' }}
      >
        <Form form={form} layout="vertical" className="A_VenueDateTime-form">
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please enter the event date' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: 'Please enter the event time' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Venue"
            name="venue"
            rules={[{ required: true, message: 'Please enter the event venue' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '42px' }}
            label="Webex Link"
            name="webexLink"
            rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input.TextArea rows={3} style={{ resize: 'none' }}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default A_VenueDateTime;
