import React from 'react';
import './UserSpotlight.css';
import BestIntern from '../UserSpotlight/BestIntern';
import InternshipTips from '../UserSpotlight/InternshipTips';

const UserSpotlightPage = ({ isLoggedIn }) => {
  // Check if the user is logged in
  if (!isLoggedIn) {
    return (
      <div className="login-alert">
        <h5>Please log in to view the content.</h5>
      </div>
    );
  }

  // Render the main content if the user is logged in
  return (
    <div className="spotlight-container">
      {/* Header Section */}
      <div className="spotlight-header">
        <div className="spotlighttext-box">
          <h1>Intern Success Spotlight</h1>
        </div>
      </div>
      <BestIntern />
      <InternshipTips />
    </div>
  );
};

export default UserSpotlightPage;
