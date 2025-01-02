import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal, Form, Input, message, Typography, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAuth } from 'firebase/auth';
import SrcButton from "../../../../src/components/button/button";
import ManageButton from "../../../components/manageButton/manageButton";
import { eventService } from "../../../services/Dashboard/eventService";
import PropTypes from 'prop-types';
import './A_EventDetails.css';

const { Meta } = Card;
const { Title } = Typography;

const A_EventDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleManageClick = (event = null) => {
    if (event) {
      form.setFieldsValue({
        title: event.title,
        time: event.time,
        description: event.description,
        img: event.img,
      });
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCancelClick = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  const handleDelete = async (eventId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      message.error("User not authenticated");
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to delete this Event?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "delete-confirm-button",
      },
      cancelButtonProps: {
        className: "cancel_button",
      },
      onOk: async () => {
        try {
          const token = await user.getIdToken();
          await eventService.deleteEvent(eventId, token);
          message.success("Event deleted successfully!");
          fetchEvents();
        } catch (error) {
          console.error('Error deleting event:', error);
          message.error('Failed to delete event');
        }
      },
    });
  };

  const handleEdit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      message.error("User not authenticated");
      return;
    }

    try {
      const values = await form.validateFields();
      setSaving(true);
      const token = await user.getIdToken();

      if (isEditMode) {
        await eventService.updateEvent(selectedEvent.id, values, token);
        message.success('Event updated successfully');
      } else {
        await eventService.addEvent(values, token);
        message.success('New event added successfully');
      }
      handleCancelClick();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      message.error('Failed to save event');
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
    <div className="event-details-container">
      <div className="event-details-header">
        <div className="admin-event-schedule-subtitle">
          <Title level={2}>Event Schedule</Title>
          <p>Join us and dive into a world of career opportunities!</p>
        </div>
        <ManageButton 
          text="Add Event" 
          onClick={() => handleManageClick(null)} 
          icon={<PlusOutlined />}
        />
      </div>
      <Row className='card-container' gutter={[16, 16]}>
        {events.map((event) => (
          <Col key={event.id} xs={24} sm={12} md={8} lg={8}>
            <Card
              hoverable
              className="front-card"
              style={{ transform: 'none', width: 380 }}
              cover={<img alt={event.title} src={event.img} style={{ height: 300, objectFit: 'cover' }} />}
            >
              <Meta className="event-meta-content" title={event.title} description={event.time} />
              <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <SrcButton
                  text="Edit"
                  onClick={() => handleManageClick(event)}
                  styleClass="btn-edit"
                  icon={<EditOutlined />}
                />
                <SrcButton
                  text="Delete"
                  onClick={() => handleDelete(event.id)}
                  styleClass="btn-delete"
                  icon={<DeleteOutlined />}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        className='A_EventScedule-modal'
        title={<div className="modal-title">Manage Talk</div>}
        open={isModalVisible}
        onCancel={handleCancelClick}
        footer={[
          <Button 
            key="cancel" 
            className='cancel_button' 
            onClick={handleCancelClick}
            disabled={saving}
          >
            Cancel
          </Button>,
          <Button 
            key="save" 
            className='save_button' 
            onClick={handleEdit}
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          className="A_EventScedule-form"
          form={form}
          layout="vertical"
          style={{ padding: '20px' }}
        >
          <Form.Item
            name="img"
            label="Image URL"
            rules={[{ required: true, message: 'Please input the image URL!' }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please input the event title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="time"
            label="Event Time"
            rules={[{ required: true, message: 'Please input the event time!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Event Description"
            rules={[{ required: true, message: 'Please input the event description!' }]}
          >
            <Input.TextArea rows={3} style={{ resize: 'none' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

A_EventDetails.propTypes = {
  initialEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
      img: PropTypes.string,
    })
  ),
};

export default A_EventDetails;