// routes.js
import React from 'react';
import LoginPage from './pages/Login/Login';
import ForgotPasswordPage from './pages/forgot-password/forgot-pswd';
import RegisterPage from './pages/Login/Register';

// Student side
import UserHomePage from './pages/user/UserHome/UserHome';
import CompanyPage from './pages/user/company(user)/Company';
import UserSpotlightPage from './pages/user/UserSpotlight/UserSpotlight';
import UserFeedbackPage from './pages/user/UserFeedback/UserFeedback';
// Admin Side
import DashboardPage from './pages/admin/Dashboard';
import CompanyManagePage from './pages/admin/company/Company';
import A_SpotlightPage from './pages/admin/AdminSpotlight/A_SpotlightPage';
import AdminFeedbackPage from './pages/admin/AdminFeedback/AdminFeedback';
import ParticipantPage from './pages/admin/Participant/Participant';


const routes = (setIsLoggedIn, setRole) => [
  //Common
  {
    name: "Login",
    route: "/",
    element: <LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
  },
  {
    name: "Forgot Password",
    route: "/forgot-pswd",
    element: <ForgotPasswordPage />
  },
  {
    name: "Register",
    route: "/register",
    element: <RegisterPage />
  },
  

  //Student Side
  {
    name: "Home",
    route: "/userhome",
    element: <UserHomePage />
  },
  {
    name: "Company",
    route: "/company",
    element: <CompanyPage />
  }, 
  {
    name: "Spotlight",
    route: "/userspotlight",
    element: <UserSpotlightPage />
  }, 
  {
    name: "Feedback",
    route: "/feedback",
    element: <UserFeedbackPage />
  },
  


  // Admin Side
  {
    name: "Dashboard",
    route: "/admin",
    element: <DashboardPage />
  },

  {
    name: "CompanyManage",
    route: "/companyManage",
    element: <CompanyManagePage />
  },
  {
    name: "Spotlight",
    route: "/a_spotlight",
    element: <A_SpotlightPage />
  },
  {
    name: "Feedback",
    route: "/adminfeedback",
    element: <AdminFeedbackPage />
  },
  {
    name: "Participant",
    route: "/participant",
    element: <ParticipantPage />
  },
];

export default routes;