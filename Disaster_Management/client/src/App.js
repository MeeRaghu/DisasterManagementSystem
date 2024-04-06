import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DisasterForm from './components/DisasterForm';
import DisasterCard from './components/DisasterCard';
import WeatherApp from './components/WeatherApp';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login_';
import DisasterList from './components/DisasterList';
import AddResource from './components/AddResource';
import ResourceDetails from './components/ResourceDetails';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ResourceApproval from './components/ResourceApproval';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in on component mount
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("hi user",user);
    if (user && user._id) {
      setIsLoggedIn(true);
      
    }
  }, []);

  const login = (responseData) => {
    if (responseData._id) {
      setIsLoggedIn(true);
      // Store user data in localStorage to persist login state
      localStorage.setItem('user', JSON.stringify(responseData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Clear user data from localStorage
    localStorage.removeItem('user');
  };
  const ProtectedRoute = ({ element: Component, ...rest }) => {
    // Check if the user is logged in by retrieving user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user._id) {
      // User is logged in, render the requested component
      return <Component {...rest} />;
    } else {
      // User is not logged in, redirect to the login page
      return <Navigate to="/login" replace />;
    }
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weatherApp" element={<WeatherApp />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route
          path="/disasterList"
          element={<ProtectedRoute element={DisasterList} />}
        />
        <Route
          path="/disasterForm"
          element={<ProtectedRoute element={DisasterForm} />}
        />
        <Route
          path="/disasterCard"
          element={<ProtectedRoute element={DisasterCard} />}
        />
        <Route
          path="/addResource"
          element={<ProtectedRoute element={AddResource} />}
        />
        <Route
          path="/resourceDetails"
          element={<ProtectedRoute element={ResourceDetails} />}
        />
        <Route
          path="/resourceApproval"
          element={<ProtectedRoute element={ResourceApproval} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
