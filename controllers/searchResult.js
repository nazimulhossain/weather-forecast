const fetch = require('node-fetch');

exports.searchResult = async (req, res, next) => {
  try {
    const userInput = req.body.input;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?&limit=5&access_token=${process.env.MAPBOX_API}`
    );
    const data = await response.json();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
