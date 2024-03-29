import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Weather from './WeatherApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import '../styles/styles.scss';

const Header = ({ className }) => {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5500/profile', { withCredentials: true });
      if (response.data) {
        const { isAdmin, name } = response.data;
        setIsAdmin(isAdmin);
        setUserName(name);
      } else {
        console.error('Error fetching user data: Response data is null');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleWeatherPopup = () => {
    setShowWeatherPopup(!showWeatherPopup);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5500/logout', null, { withCredentials: true });
      localStorage.clear()
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const navigateToDisasterCard = () => {
    navigate('/disasterCard');
  };

  return (
    <header className={`header ${className}`}>
      <nav className="nav">
        <div className="logo">
          <p><FontAwesomeIcon icon={faBuilding} /> Binary Bridge</p> {/* Add Building icon */}
        </div>
        <div className="nav-links">
          {!isHomePage && !userName && <Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link>} {/* Add Home icon and condition for user */}
          {userName && (
            <div className="welcome-message"> 
              {isAdmin ? <p><FontAwesomeIcon icon={faUser} /> {/* Add User icon */} Admin</p> : <p> <FontAwesomeIcon icon={faUser} /> {/* Add User icon */}{userName}</p>}
            </div>
          )}
          {isHomePage && <button onClick={toggleWeatherPopup}>Weather App</button>}
          {!userName && !isLoginPage && <Link to="/login">Sign In</Link>}
          {!userName && !isRegisterPage && <Link to="/register">Sign Up</Link>}
          {isAdmin && location.pathname !== '/disasterForm' && <Link to="/disasterForm">ManageDisaster</Link>}
          {isAdmin && location.pathname === '/disasterForm' && (
            <p className="toggle" onClick={navigateToDisasterCard}>Disaster Card</p>
          )}
          {userName && (
            <p className="logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {/* Add Logout icon */}
              Logout
            </p>
          )}
        </div>
      </nav>

      {showWeatherPopup && <Weather onClose={toggleWeatherPopup} />}
    </header>
  );
};

export default Header;
