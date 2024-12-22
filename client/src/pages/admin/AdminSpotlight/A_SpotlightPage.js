import React from 'react';
import './A_SpotlightPage.css';
import A_BestIntern from '../AdminSpotlight/A_BestIntern';
import A_InternshipTips from '../AdminSpotlight/A_InternshipTips';

const A_SpotlightPage = () => {
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
