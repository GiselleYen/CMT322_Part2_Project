import React, { useState, useEffect } from 'react';
import './A_SpotlightPage.css';
import A_BestIntern from '../AdminSpotlight/A_BestIntern';
import A_InternshipTips from '../AdminSpotlight/A_InternshipTips';
import { Spin } from 'antd'; // Import the Spin component for loading spinner

const A_SpotlightPage = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect(() => {
    // Simulate data fetching or some other async operation
    setTimeout(() => {
      setLoading(false); // Set loading to false after fetching data
    }, 600); // Simulating a 0.6 second delay (replace this with actual data fetching logic)
  }, []);

  if (!isLoggedIn) {
    return <div className='login-alert'><h5>Please log in to view the content.</h5></div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="spotlight-container">
      {/* Header Section */}
      <div className="spotlight-header">
        <div className="spotlighttext-box">
          <h1>Intern Success Spotlight</h1>
        </div>
      </div>
      <A_BestIntern />
      <A_InternshipTips />
    </div>
  );
};

export default A_SpotlightPage;
