import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '../button/button';

function Header({ isLoggedIn, role, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu visibility on mobile
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    onLogout();  // Call onLogout from props
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      if (role === 'student') {
        navigate('/userhome');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } else {
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close menu after a link is clicked (for mobile view)
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <img src="logo.png" alt="Logo" />
      </div>

      <div className="menu-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰ {/* Hamburger Icon */}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isLoggedIn && (
            <>
              {role === 'student' && (
                <>
                  <Link to="/userhome">Home</Link>
                  <Link to="/company">Company</Link>
                  <Link to="/userspotlight">Intern Spotlight</Link>
                  <Link to="/feedback">Feedback</Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link to="/admin">Dashboard</Link>
                  <Link to="/companyManage">Company</Link>
                  <Link to="/a_spotlight">Intern Spotlight</Link>
                  <Link to="/adminfeedback">Feedback</Link>
                  <Link to="/participant">Participant</Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Profile Icon */}
        {isLoggedIn && (
          <div className="profile-icon-link">
            <AccountCircleIcon className="profile-icon" />
            <div className="dropdown-menu">
              <Button 
                text="Log Out" 
                onClick={handleLogout} 
                styleClass="logout-btn" 
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
