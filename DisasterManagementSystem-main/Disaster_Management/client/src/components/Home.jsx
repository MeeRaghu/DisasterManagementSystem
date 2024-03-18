// Home.jsx

import React from 'react';
import Header from './Header'; // Assuming you have a Header component
import Footer from './Footer'; // Assuming you have a Footer component
import '../styles/styles.scss';

const Home = () => {
  return (
    <div>
      <Header className="home-header" />
      {/* Your home page content goes here */}
      <div className="background-image">
        <div className="content-container">
          <h1 className='main-h'>Welcome to Disaster Management System</h1>
          <p>Explore our features and services...</p>
        </div>
      </div>
      <Footer className="home-footer" />
    </div>
  );
};

export default Home;
