import React, { useState, useEffect } from 'react';
import {message } from 'antd';
import { venueDateTimeService } from '../../../services/Dashboard/venueDateTimeService';
import './VenueAndDateTime.css'; 

const VenueAndDateTime = () => {
   const [loading, setLoading] = useState(false);
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

  return (
    <div className="venue-banner" style={{ backgroundImage: 'url(/assets/images/DT_bg.png)'}}>
      <div className="venue-banner-content">
        <h2 className="event-title">VCSIRF Date and Venue</h2>
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
  );
};

export default VenueAndDateTime;