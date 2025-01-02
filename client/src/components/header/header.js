import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '../button/button';
import { authService } from '../../services/authService';

function Header({ isLoggedIn, role, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to validate session only once or when location changes
  useEffect(() => {
    // console.log("Location changed:", location.pathname); // Debug log
    const validSession = authService.isSessionValid();
    // console.log("Session valid:", validSession); // Debug log

    if (!validSession && isLoggedIn) {
      console.log("Invalid session, logging out...");
      onLogout(); // Log out if the session is invalid
      navigate('/'); // Redirect to home
    }
  }, [location, isLoggedIn, onLogout, navigate]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
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
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <img src="logo.png" alt="Logo" />
      </div>

      <div className="menu-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isLoggedIn && (
            <>
              {role === 'student' && (
                <>
                  <Link to="/userhome" onClick={closeMenu}>Home</Link>
                  <Link to="/company" onClick={closeMenu}>Company</Link>
                  <Link to="/userspotlight" onClick={closeMenu}>Intern Spotlight</Link>
                  <Link to="/feedback" onClick={closeMenu}>Feedback</Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
                  <Link to="/companyManage" onClick={closeMenu}>Company</Link>
                  <Link to="/a_spotlight" onClick={closeMenu}>Intern Spotlight</Link>
                  <Link to="/adminfeedback" onClick={closeMenu}>Feedback</Link>
                  <Link to="/participant" onClick={closeMenu}>Participant</Link>
                </>
              )}
            </>
          )}
        </nav>

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
