import React from 'react';
import { Carousel } from 'antd';
import './UserHome.css';
import EventDetails from './EventDetails'; 
import VenueAndDateTime from './VenueAndDateTime';
import FAQ from './FAQ'

const UserHomePage = () => {
  return (
    <div>
      <div className="user-home_container">
        <div className="user-home_announcement">
          Latest Announcement
        </div>
        <Carousel autoplay dotPosition="right" infinite={true} style={{ height: '400px' }}>
          <div>
            <div className="carousel-slide bg-image" style={{ backgroundImage: 'url(/assets/images/Announcement_A.png)', color: "var(--primary-color)" }}>
              <h3>Announcement for Internship Application Deadlines</h3>
              <p>Reminder: The deadline to apply for the summer internship program is fast approaching! Make sure to submit your applications by May 15th, 2024. Don't miss this opportunity to gain hands-on experience in your field of interest.</p>
            </div>
          </div>
          <div>
            <div className="carousel-slide bg-image" style={{ backgroundImage: 'url(/assets/images/Announcement_B.png)', color: "var(--secondary-color)" }}>
              <h3>Unlocking Interview Success:<br/>
              Insights from Industry Experts</h3>
              <p>Get industry insights in our expert panel session.</p>
            </div>
          </div>
          <div>
            <div className="carousel-slide bg-image" style={{ backgroundImage: 'url(/assets/images/Announcement_C.png)', color: "var(--primary-color)" }}>
              <h3>Sharing Session:<br/>
              How to Optimize Your LinkedIn Profile</h3>
              <p>Uncover the secrets of LinkedIn optimization</p>
            </div>
          </div>
        </Carousel>      
      </div>

      <VenueAndDateTime />
      
      <EventDetails />

      <FAQ/>
    </div>
  );
};

export default UserHomePage;
