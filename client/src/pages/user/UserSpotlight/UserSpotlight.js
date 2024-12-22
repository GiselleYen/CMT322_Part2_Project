import React from 'react';
import './UserSpotlight.css';
import BestIntern from '../UserSpotlight/BestIntern';
import InternshipTips from '../UserSpotlight/InternshipTips';


const UserSpotlightPage = () => {
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
