import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Weather from './WeatherApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
      localStorage.clear();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigateToResourceApproval = () => {
    navigate('/resourceApproval');
  };

  const navigateToDisasterCard = () => {
    navigate('/disasterCard');
  };

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isLoggedIn = !!userName;

  return (
    <header className={`header ${className}`}>
      <nav className="nav">
        <div className="logo">
          <p>
            <FontAwesomeIcon icon={faBuilding} />
            {' '}
            Binary Bridge
          </p>
        </div>
        <div className="nav-links">
          {!isHomePage && !userName && (
            <Link to="/" className="nav-link-box">
              <FontAwesomeIcon icon={faHome} />
              {' '}
              Home
            </Link>
          )}
          {userName && (
            <div className="welcome-message">
              {isAdmin ? (
                <Link  className="nav-link-box">
                  <FontAwesomeIcon icon={faUser} />
                  {' '}
                  Admin
                </Link>
              ) : (
                <Link  className="nav-link-box">
                  {' '}
                  <FontAwesomeIcon icon={faUser} />
                  {' '}
                  {userName}
                </Link>
              )}
            </div>
          )}
          {isHomePage && (
            <button onClick={toggleWeatherPopup} className="weather-button">
              Weather App
            </button>
          )}
          {!userName && !isLoginPage && (
            <Link to="/login" className="auth-link-box">
              Sign In
            </Link>
          )}
          {!userName && !isRegisterPage && (
            <Link to="/register" className="auth-link-box">
              Sign Up
            </Link>
          )}
          {isAdmin && (
  <>
    {location.pathname !== '/disasterForm' && (
      <Link to="/disasterForm" className="nav-link-box">
        Manage Disaster
      </Link>
    )}
    {location.pathname !== '/disasterCard' && (
      <Link to="/disasterCard" className="nav-link-box">
        Disaster Card
      </Link>
    )}
  </>
)}

          {isLoggedIn && isHomePage && (
            <Link to="/disasterCard" className="nav-link-box">
              Disaster Card
            </Link>
          )}
          {isAdmin && (
            <Link to="/resourceApproval" className="nav-link-box">
              Approve Resource
            </Link>
          )}
          {userName && (
            <p className="logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              {' '}
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
