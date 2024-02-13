const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { city } = req.body;
    const apiKey = '7ffc5e7596396b10eec247641cae3fd5'; // replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await axios.get(apiUrl);

    const weatherData = response.data;
    const warning = weatherData.list.some(entry => entry.weather[0].main === 'Thunderstorm');

    const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

    // Extract data for the next 7 days
    const forecast = weatherData.list
      .filter((entry, index) => index % 8 === 0 && index < 8 * 7) // Get every 8th entry (one per day) for the next 7 days
      .map(dayEntry => {
        // Convert UTC timestamp to local time (Eastern Time)
        const localDate = new Date(dayEntry.dt_txt + ' UTC');
        
        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        const formattedDate = localDate.toLocaleDateString('en-US', options);

        return {
          date: formattedDate, // Use local date instead of local time
          morning: {
            description: dayEntry.weather[0].description,
            temperature: parseFloat(kelvinToCelsius(dayEntry.main.temp)),
            feelsLike: parseFloat(kelvinToCelsius(dayEntry.main.feels_like)),
            windSpeed: dayEntry.wind.speed,
            windDirection: dayEntry.wind.deg,
            pressure: dayEntry.main.pressure,
            humidity: dayEntry.main.humidity,
            uv: 1, // Placeholder for UV (You might need another API for this)
            dewPoint: parseFloat(kelvinToCelsius(dayEntry.main.temp - dayEntry.main.humidity / 2)), // Placeholder for dew point
            visibility: 10.0, // Placeholder for visibility
          },
        };
      });

    res.json({ success: true, warning, forecast });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
  }
};

module.exports = {
  getWeather,
};
