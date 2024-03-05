// WeatherApp.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Modal from './WeatherModal';
import '../styles/WeatherApp.scss';

const Weather = () => {
  const [city, setCity] = useState('');
  const [warning, setWarning] = useState('');
  const [forecast, setForecast] = useState([]);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(true);

  const handleFetchWeather = async () => {
    try {
      const response = await axios.post('http://localhost:5500/getWeather', { city });
      const data = response.data;
  
      if (data.success) {
        setWarning(data.warning);
        setForecast(data.forecast);
        setMessage('');
        setShowPopup(true);  // Set showPopup to true only when data is successfully fetched
      } else {
        setMessage('Failed to fetch weather data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setMessage('Failed to fetch weather data. Please try again.');
    }
  };
  

  const handleClose = () => {
    console.log("closing modal");
    setShowPopup(false);
  };

  const renderWeatherIcon = (description) => {
    switch (true) {
      case description && description.includes('clouds'):
        return <img src='/assets/cloudy.png' alt="Cloudy Weather" className="weather-icon" />;
      case description && description.includes('thunderstorm'):
        return <img src='/assets/sunny.png' alt="Sunny Weather" className="weather-icon" />;
      case description && description.includes('rain'):
        return <img src='/assets/rain.png' alt="Rainy Weather" className="weather-icon" />;
      case description && description.includes('mist'):
        return <img src='/assets/haze.png' alt="Haze Weather" className="weather-icon" />;
      case description && description.includes('drizzle'):
        return <img src='/assets/rain.png' alt="Drizzling Weather" className="weather-icon" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  

  return (
    <Modal onClose={handleClose} show={showPopup}>
      <h2>Weather Information</h2>
      <label>
        Enter city:
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <button type="button" onClick={handleFetchWeather}>
        Get Weather
      </button>

      <p>{message}</p>
      {warning && <p style={{ color: 'red' }}>{warning}</p>}

      {forecast.length > 0 && (
        <div>
          <h3>Current Weather:</h3>
          <p>{`${formatDate(forecast[0].date)}: ${forecast[0].morning?.description || 'N/A'}`}</p>
          <p>{`Temperature: ${Math.floor(forecast[0].morning?.temperature) || 'N/A'}°C`}</p>
          <p>{`Feels like: ${Math.floor(forecast[0].morning?.feelsLike) || 'N/A'}°C`}</p>
          <p>{`Wind: ${forecast[0].morning?.windSpeed || 'N/A'}m/s ${forecast[0].morning?.windDirection || 'N/A'}`}</p>
          <p>{`Pressure: ${forecast[0].morning?.pressure || 'N/A'}hPa`}</p>
          <p>{`Humidity: ${forecast[0].morning?.humidity || 'N/A'}%`}</p>
          <p>{`UV: ${forecast[0].morning?.uv || 'N/A'}`}</p>
          <p>{`Dew point: ${forecast[0].morning?.dewPoint || 'N/A'}°C`}</p>
          <p>{`Visibility: ${forecast[0].morning?.visibility || 'N/A'}km`}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h3>5 Days Forecast:</h3>
          <ul>
            {forecast.map((item, index) => (
              <li key={index}>
                {`${formatDate(item.date)}, ${Math.floor(item.morning?.temperature) || 'N/A'} / ${Math.floor(item.morning?.feelsLike) || 'N/A'}°C, ${item.morning?.description || 'N/A'}`}
                <img src={`/assets/${item.morning?.description.toLowerCase()}.png`} alt={item.morning?.description} className="weather-icon" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button  onClick={handleClose}>Close</button>
    </Modal>
  );
};

export default Weather;
