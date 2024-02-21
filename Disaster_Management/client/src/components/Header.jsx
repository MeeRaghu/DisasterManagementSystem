// Header.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Weather from './WeatherApp'; // Import your Weather component
import '../styles/styles.scss';

const Header = ({ className }) => {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);
  const location = useLocation();

  // Function to toggle the visibility of the weather popup
  const toggleWeatherPopup = () => {
    setShowWeatherPopup(!showWeatherPopup);
  };

  // Determine if the current location is the home page
  const isHomePage = location.pathname === '/';

  return (
    <header className={`header ${className}`}>
      <nav className="nav">
        <div className="logo">
         <p>Binary Bridge</p>
        </div>
        <div className="nav-links">
          {/* Use a button instead of Link to trigger weather popup */}
          {!isHomePage && <Link to="/">Home</Link>} {/* Conditionally render home link */}
          <button onClick={toggleWeatherPopup}>Weather App</button>
          
          {location.pathname !== '/register' && <Link to="/register">Sign Up</Link>}
          {location.pathname !== '/login' && <Link to="/login">Sign In</Link>}
          
        </div>
      </nav>

      {/* Conditionally render the Weather component based on the state */}
      {showWeatherPopup && <Weather onClose={toggleWeatherPopup} />}
    </header>
  );
};

export default Header;
