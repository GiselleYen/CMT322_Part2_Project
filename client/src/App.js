import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import routes from './routes';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // 'student', 'admin', or null

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
  };

  return (
    <Router>
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
