import React from 'react';
import A_Announcement from './Dashboard/A_Announcement';
import A_VenueDateTime from './Dashboard/A_VenueDateTime';
import A_EventDetails from './Dashboard/A_EventDetails';
import AdminFAQ from './Dashboard/A_FAQ'

const DashboardPage = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return <div className='login-alert'><h5>Please log in to view the content.</h5></div>;
  }
  
  return (
    <div>
      {/* <h1>Welcome to the Admin Dashboard Page</h1> */}
      <A_Announcement />
      <A_VenueDateTime />
      <A_EventDetails />
      <AdminFAQ/>
    </div>
  );
};

export default DashboardPage;