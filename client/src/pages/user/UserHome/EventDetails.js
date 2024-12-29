import React, { useState, useEffect } from 'react';
import { Card, Col, Row , Typography, message} from 'antd';
import { eventService } from "../../../services/Dashboard/eventService";
import './EventDetails.css';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const EventDetails = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState([]);
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

  return (
    <div className="event-details-container">
      <div className="event-schedule-subtitle">
        <Title level={2}>Event Schedule</Title>
        <p>Join us and dive into a world of career opportunities!</p>
      </div>
      <Row className='card-container' gutter={[16, 16]}>
        {events.map((event, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8}>
            <div className="card-flip-container">
              <div className="card-flip">
                <Card
                  hoverable
                  className="front-card"
                  cover={
                    <img
                      alt={event.title}
                      src={event.img}
                      style={{
                        height: 300, 
                        objectFit: 'cover', 
                      }}
                    />
                  }
                >
                  <Meta className="event-meta-content" title={event.title} description={event.time} />
                </Card>
                <div className="back-card">
                  <div className="back-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EventDetails;
