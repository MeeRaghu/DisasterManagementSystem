// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DisasterForm from './components/DisasterForm';
import DisasterCard from './components/DisasterCard';
import WeatherApp from './components/WeatherApp';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login_';

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
      </Routes>
    </Router>
  );
}

export default App;
