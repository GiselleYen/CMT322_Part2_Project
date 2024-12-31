import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components
import Header from './components/header/header';
import Footer from './components/footer/footer';
import routes from './routes';
import './App.css';
import { authService } from './services/authService';
import SessionChecker from './session/sessionchecker';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // 'student', 'admin', or null

  const handleLogin = (role, token) => {
    const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes expiry time
    authService.setSession(role, token, expiryTime); // Save session using the service
    setIsLoggedIn(true);
    setRole(role);
  };

  const handleLogout = () => {
    // Clear session using the service
    authService.clearSession();
    setIsLoggedIn(false);
    setRole('');
  };

  return (
    <Router>
      {/* SessionChecker runs in the background and checks for session expiry */}
      <SessionChecker />

      <Header isLoggedIn={isLoggedIn} role={role} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          {routes(setIsLoggedIn, setRole).map(({ route, element }) => (
            <Route
              key={route}
              path={route}
              element={React.cloneElement(element, { isLoggedIn, role })}
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
