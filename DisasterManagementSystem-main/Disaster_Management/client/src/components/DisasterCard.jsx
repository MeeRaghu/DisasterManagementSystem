import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/DisasterCard.scss';

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
      <h2>Disaster Cards</h2>
      <Slider {...settings}>
        {disasters.map((disaster) => (
          <div key={disaster._id} className="disaster-card">
            <div className="card-content">
              <p>{disaster.type}</p>
              <p>Location: {disaster.location}</p>
              <p>Description: {disaster.description}</p>
              <p>Date and Time: {disaster.dateAndTime}</p>
              <p>Severity Level: {disaster.severityLevel}</p>
            </div>
            {disaster.image && <img src={`http://localhost:5500/assets/${disaster.image}`} alt="Disaster" className="card-image" />}
            <hr />
            <button className="add-resource-button">Add Resource</button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DisasterCard;
