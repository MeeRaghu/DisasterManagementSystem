// client/src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Weather from './WeatherApp'; // Import your Weather component
import '../styles/styles.scss';

const Header = () => {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);

  // Function to toggle the visibility of the weather popup
  const toggleWeatherPopup = () => {
    setShowWeatherPopup(!showWeatherPopup);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">Binary Bridge</div>
        <div className="nav-links">
          {/* Use a button instead of Link to trigger weather popup */}
          <button onClick={toggleWeatherPopup}>Weather App</button>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">SignIn</Link>
        </div>
      </nav>

      {/* Conditionally render the Weather component based on the state */}
      {showWeatherPopup && <Weather onClose={toggleWeatherPopup} />}
    </header>
  );
};

export default Header;
