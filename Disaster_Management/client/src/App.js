// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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




//import Footer from './Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Home /></>} />
        <Route path="/disasterCard" element={<DisasterCard />} />
        <Route path="/weatherApp" element={<WeatherApp />} />
        <Route path="/DisasterForm" element={<DisasterForm />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/disasterList" element={<DisasterList />} />
        <Route path="/AddResource" element={<AddResource />} />
        <Route path="/resourceDetails" element={<ResourceDetails />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />}/>
        <Route path="/resourceApproval" element={<ResourceApproval />}/>
      </Routes>
    </Router>
  );
}

export default App;
