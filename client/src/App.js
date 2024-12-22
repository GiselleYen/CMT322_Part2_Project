import React, { useState } from 'react'; 
import {  BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import routes from './routes';
import './App.css';
import LoginPage from './pages/Login/Login';  

function App() {
  // Track login status and role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');  // 'student', 'admin', or null

 

  // const handleLogin = (userRole) => {
  //   setIsLoggedIn(true);
  //   setRole('');  // Setting the role after login
  // };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');  // Resetting the role when logging out
    
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} role={role} onLogout={handleLogout} />
      
      <div className="main-content">
        <Routes>
          {/* Dynamically generate routes */}
          {routes(setIsLoggedIn, setRole).map(({ route, element }) => (
            <Route key={route} path={route} element={element} />
          ))}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
