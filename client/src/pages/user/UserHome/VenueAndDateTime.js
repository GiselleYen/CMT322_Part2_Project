import React from 'react';
import './VenueAndDateTime.css'; 

const VenueAndDateTime = () => {
  const eventDetails = {
    date: '4th December 2023',
    time: '8:45 AM - 4:30 PM (GMT+8)',
    venue: 'Online',
    webexLink: 'https://meet1423.webex.com/wbxmjs/joinservice/sites/meet1423/meeting/download/c44e3b9554904d57936b51678ea3c6f8?siteurl=meet1423&MTID=m905c71cb000dec77dc3a62d640e1d1ea', // Replace this with your actual Webex link
  };

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