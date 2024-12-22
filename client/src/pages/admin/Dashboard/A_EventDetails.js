import React, { useState} from 'react';
import { Card, Col, Row, Button, Modal, Form, Input, message, Typography, Upload } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SrcButton from "../../../../src/components/button/button";
import ManageButton from "../../../components/manageButton/manageButton";
import './A_EventDetails.css';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const A_EventDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [events, setEvents] = useState([
    {
      title: 'Participants enter the meeting',
      time: '8.45 AM - 9.00 AM',
      description: 'A welcoming session where participants gather and get introduced to the agenda of the summer internship program, offering valuable hands-on experience in a professional environment.',
      img: '/assets/images/Event-1.jpg',
    },
    {
      title: 'VCSIRF Opening Ceremony',
      time: '9.00AM - 10.30AM',
      description: 'Join us for the opening ceremony featuring a panel discussion with industry leaders, exploring emerging trends in technology, career insights, and the future of computer science.',
      img: '/assets/images/Event-2.jpg',
    },
    {
      title: 'Platinum Talk | GoSaaS Malaysia',
      time: '10.35AM - 11.35AM',
      description: "GoSaaS is an Oracle partner, specializing in the implementation of Oracle Fusion Cloud solutions. Headquartered in the USA with additional offices in Canada and Malaysia, as well as a strong presence in Pakistan and India, GoSaaS consistently ranks among the USA's fastest-growing companies and has received Fortune 5000 recognition for three consecutive years, attesting to our commitment to innovation and customer satisfaction. We specialize in providing cloud computing services for medium to large enterprises in high-tech manufacturing industries, life sciences, and semiconductors.",
      img: '/assets/images/Event-3.jfif',
    },
    {
      title: 'Platinum Talk | Macrobase System',
      time: '11.40AM - 12.40PM',
      description: 'Macrobase System is a software development company that has strong domain knowledge in multiple fields such as manufacturing, retail, FMCG, and servicing industries. The company focuses on delivering customized solutions to meet customer detailed requirements. Macrobase System has implemented CRM systems for multiple brand owners in Malaysia with a total of more than 60 branches in combination.',
      img: '/assets/images/Event-4.jfif',
    },
    {
      title: 'Diamond Talk | Pingspace',
      time: '12.45PM - 1.25PM',
      description: 'Pingspace, a robotics warehouse company is on a mission to simplify, digitize and automate warehouse industry. Our innovative systems span various business and technology domains including warehouse management systems, workflow management, inventory management, and AGV traffic control. In Pingspace, our team is comprised of dynamic group of individuals driven by energy, passion, and a relentless pursuit of excellence in achieving our mission. On a daily basis, our engineers tackle a diverse array of challenges, from ensuring the reliability of distributed systems to exploring machine learning, database design, and optimizing workflow management performance.',
      img: '/assets/images/Event-5.jfif',
    },
    {
      title: 'Lunch Break',
      time: '1.25PM - 2.25PM',
      description: 'Take a break and recharge with a casual lunch hour.',
      img: '/assets/images/Event-6.jpg',
    },
    {
      title: 'Collaborative Company | Telebort',
      time: '2.25PM - 2.50PM',
      description: 'Bringing people together through education and technology.',
      img: '/assets/images/Event-7.jpg',
    },
    {
      title: 'Best Intern Sharing Session',
      time: '3.00PM - 4.00PM',
      description: 'Join us for an insightful session where top interns share their experiences and tips on making the most out of internships. Gain valuable advice on career development, skill-building, and how to stand out in a competitive job market.',
      img: '/assets/images/Event-8.jfif',
    },
    {
      title: 'Closing Ceremony + Lucky Draw',
      time: '3.00PM - 4.00PM',
      description: 'Celebrate the end of the event with the closing ceremony and an exciting lucky draw!',
      img: '/assets/images/Event-9.jpg',
    },
    {
      title: 'End of VCSIF 2023',
      time: '4.00PM',
      description: "Wrap up VCSIF 2023 with a memorable closing moment as we reflect on the event's highlights.",
      img: '/assets/images/Event-2.jpg',
    },
  ]);
  const [file, setFile] = useState(null); // To store the selected file

  const handleManageClick = (event = null) => {
    if (event) {
      form.setFieldsValue({
        title: event.title,
        time: event.time,
        description: event.description,
      });
      setFile(event.img); // Set the current image to be displayed
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      form.resetFields();
      setFile(null);
    }
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCancelClick = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
    setFile(null);
  };

  const handleDelete = (eventTitle) => {
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
      onOk() {
        setEvents(events.filter(event => event.title !== eventTitle)); // Delete based on title
        message.success ("Event deleted successfully!");
      
      },
    });
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const updatedEvent = { ...values, img: file };

      if (isEditMode) {
        // Update existing event based on title
        const updatedEvents = events.map(event =>
          event.title === selectedEvent.title ? { ...event, ...updatedEvent } : event
        );
        setEvents(updatedEvents);
        message.success('Event updated successfully');
      } else {
        const newEvent = { ...updatedEvent, title: `Event ${events.length + 1}` }; // New event with generated title
        setEvents([...events, newEvent]);
        message.success('New event added successfully');
      }
      handleCancelClick();
    } catch (error) {
      console.error('Form validation failed: ', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile)); // Show image preview
    }
  };

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
        />
      </div>
      <Row className='card-container' gutter={[16, 16]}>
        {events.map((event, index) => (
          <Col key={event.title} xs={24} sm={12} md={8} lg={8}>
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
                  onClick={() => handleDelete(event.title)} // Delete by title
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
        visible={isModalVisible}
        onCancel={handleCancelClick}
        footer={[
          <Button key="cancel" className='cancel_button' onClick={handleCancelClick}>Cancel</Button>,
          <Button key="edit" className='save_button' onClick={handleEdit}>Save</Button>,
        ]}
      >
        <Form
          className="A_EventScedule-form"
          form={form}
          layout="vertical"
          style={{ padding: '20px' }}
        >
          <Form.Item
            name="Talk Poster"
            label="Talk Poster"
          >
            <input type="file" onChange={handleFileChange} />
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

export default A_EventDetails;