import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import routes from './routes';
import './App.css';
import { authService } from './services/authService';
import SessionChecker from './session/sessionchecker';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isSessionValid());
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    if (isLoggedIn && authService.isSessionValid()) {
      const currentPage = authService.getCurrentPage();
      if (window.location.pathname !== currentPage) {
        window.location.href = currentPage; // Redirect to the last visited page
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (role, token) => {
    const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes expiry
    authService.setSession(role, token, expiryTime); // Save session
    setIsLoggedIn(true);
    setRole(role);
    const currentPage = authService.getCurrentPage() || '/';
    window.location.href = currentPage; // Redirect to last visited page
  };

  const handleLogout = () => {
    authService.clearSession();
    setIsLoggedIn(false);
    setRole('');
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <Router>
      <SessionChecker />
      <Header isLoggedIn={isLoggedIn} role={role} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          {routes(setIsLoggedIn, setRole).map(({ route, element }) => (
            <Route
              key={route}
              path={route}
              element={React.cloneElement(element, { isLoggedIn, role, handleLogin })}
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
