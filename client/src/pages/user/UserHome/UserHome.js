// userhome.js
import React, { useState, useEffect } from "react";
import { Carousel, message } from 'antd';
import './UserHome.css';
import EventDetails from './EventDetails'; 
import VenueAndDateTime from './VenueAndDateTime';
import { getAuth } from "firebase/auth";
import { announcementService } from "../../../services/Dashboard/announcementService";
import FAQ from './FAQ'

const UserHomePage = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { title: "", description: "", bgImage: "/assets/images/Announcement_A.png", color: "var(--primary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_B.png", color: "var(--secondary-color)" },
    { title: "", description: "", bgImage: "/assets/images/Announcement_C.png", color: "var(--primary-color)" },
  ]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements((prev) =>
          prev.map((announcement, index) => ({
            ...announcement,
            title: data[index]?.title || announcement.title,
            description: data[index]?.description || announcement.description,
            id: data[index]?.id || null, // Preserve ID for updating
          }))
        );
      } catch (error) {
        console.error("Error fetching announcements:", error);
        message.error("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!isLoggedIn) {
    return <div className='login-alert'><h5>Please log in to view the content.</h5></div>;
  }

  return (
    <div>
      <div className="user-home_container">
        <div className="user-home_announcement">
          Latest Announcement
        </div>
        <Carousel 
          autoplay 
          dotPosition="right" 
          infinite={true} 
          style={{ height: "400px", marginBottom: "20px" }}
        >
          {announcements.map((announcement, index) => (
            <div key={index}>
              <div
                className="carousel-slide bg-image"
                style={{ 
                  backgroundImage: `url(${announcement.bgImage})`, 
                  color: announcement.color 
                }}
              >
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
              </div>
            </div>
          ))}
        </Carousel>     
      </div>

      <VenueAndDateTime />
      
      <EventDetails />
      
      <FAQ />
    </div>
  );
};

export default UserHomePage;
