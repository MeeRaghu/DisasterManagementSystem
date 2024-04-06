const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { city } = req.body;
    const apiKey = '7ffc5e7596396b10eec247641cae3fd5'; // replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);

    const weatherData = response.data;
    const timezoneOffset = weatherData.city.timezone; // Time zone difference in seconds from UTC

    const forecast = weatherData.list
      .filter((entry, index) => index % 8 === 0 && index < 8 * 5) // Adjust for 5 days
      .map(dayEntry => {
        const utcDate = new Date(dayEntry.dt * 1000); // Convert UTC timestamp to milliseconds
        const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000); // Adjust date by timezone offset

        return {
          date: localDate, // Store the adjusted Date object
          morning: {
            description: dayEntry.weather[0].description,
            temperature: dayEntry.main.temp,
            feelsLike: dayEntry.main.feels_like,
            windSpeed: dayEntry.wind.speed,
            windDirection: dayEntry.wind.deg,
            pressure: dayEntry.main.pressure,
            humidity: dayEntry.main.humidity,
            uv: 1, // Placeholder for UV (You might need another API for this)
            dewPoint: dayEntry.main.dew_point,
            visibility: dayEntry.visibility / 1000, // Convert visibility to kilometers
          },
        };
      });

    res.json({ success: true, forecast });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
  }
};


module.exports = {
  getWeather,
};
