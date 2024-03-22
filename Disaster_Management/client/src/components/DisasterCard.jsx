import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/DisasterCard.scss';
import Header from '../components/Header'; 
import Footer from '../components/Footer';

const DisasterCard = () => {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    const fetchAndSortDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:5500/getDisasters');
        const sortedDisasters = response.data.sort((a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime));
        setDisasters(sortedDisasters);
      } catch (error) {
        console.error('Error fetching and sorting disasters:', error);

        if (error.response) {
          console.error('Server Response Data:', error.response.data);
        }
      }
    };

    fetchAndSortDisasters();
  }, []); // Empty dependency array, runs once on mount

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <div>
      <Header />
      <div>
        <h2 style={{ fontWeight: 'bold' }}>Disaster Cards</h2>
        <Slider {...settings}>
          {disasters.map((disaster) => (
            <div key={disaster._id} className="disaster-card">
              <Link to="/addResource" style={{ float:"right" }}> 
                <button className="add-resource-button">Add Resource</button>
              </Link>
              <div className="card-content">
                <p><strong>{disaster.type}</strong></p>
                <p><strong>Location:</strong> {disaster.location}</p>
                <p><strong>Description:</strong> {disaster.description}</p>
                <p><strong>Date and Time:</strong> {disaster.dateAndTime}</p>
                <p><strong>Severity Level:</strong> {disaster.severityLevel}</p>
              </div>
              {disaster.image && <img src={`http://localhost:5500/assets/${disaster.image}`} alt="Disaster" className="card-image" />}
              <hr />
            </div>
          ))}
        </Slider>
      </div>
      <div></div>
      <Footer />
    </div>
  );
};

export default DisasterCard;
