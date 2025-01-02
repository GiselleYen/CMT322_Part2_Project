import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Spin } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { auth } from '../../../config/firebase';
import { venueDateTimeService } from '../../../services/Dashboard/venueDateTimeService';
import './A_VenueDateTime.css';

const A_VenueDateTime = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // For fetching data
  const [saving, setSaving] = useState(false); // For saving data
  const [form] = Form.useForm();
  const { currentUser } = auth;
  const [eventDetails, setEventDetails] = useState({
    date: '',
    time: '',
    venue: '',
    webexLink: '',
  });

  const loadVenueDateTime = async () => {
    setLoading(true);
    try {
      const data = await venueDateTimeService.getVenueDateTime();
      setEventDetails(data);
    } catch (error) {
      message.error('Failed to load venue and time details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenueDateTime();
  }, []);

  const showModal = () => {
    if (!currentUser) {
      message.error('Please login to manage venue details');
      return;
    }
    setIsModalVisible(true);
    form.setFieldsValue(eventDetails);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const idToken = await currentUser.getIdToken();

      setSaving(true);
      await venueDateTimeService.updateVenueDateTime(values, idToken);
      setEventDetails(values);
      message.success('Date, Time, and Venue updated successfully');
      setIsModalVisible(false);
      loadVenueDateTime(); // Refresh data
    } catch (error) {
      message.error('Failed to update venue details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      <div className="venue-banner" style={{ backgroundImage: 'url(/assets/images/DT_bg.png)'}}>
        <div className="venue-banner-content">
          <div className="event-header">
            <h2 className="event-title">VCSIRF Date and Venue</h2>
            {currentUser && (
              <Button 
                type="primary" 
                className="manage-event-button" 
                icon={<PlusOutlined />} 
                onClick={showModal}
              >
                Manage Venue and DateTime
              </Button>
            )}
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
        title={<div className="modal-title">Manage Event</div>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        width={600}
        okButtonProps={{ className: 'save_button', loading: saving, disabled: saving }}
        cancelButtonProps={{ className: 'cancel_button', disabled: saving }}
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
