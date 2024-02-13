// client/src/components/Home/Home.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/styles.scss';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <div className="background-image">
        <div className="content-container">
          <h1>Welcome to Disaster Management System</h1>
          <p>Explore our features and services...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
