const fetch = require('node-fetch');

exports.currentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=${lat},${lon}&aqi=yes`
    );

    const result = await response.json();
    req.session.weather = result;

    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getWeather = (req, res) => {
  try {
    const { weather } = req.session;
    res.status(200).render('weather', {
      title: `${weather.location.name},${weather.location.region},${weather.location.country} Weather Forecast`,
      weather: req.session.weather,
    });
  } catch (err) {
    console.log(err);
  }
};
