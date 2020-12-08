
'use strict';


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

app.get('/location', function (req, res) {
  const GEOCODE_API_KEY = process.env.GEOCODE_API;
  const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${req.query.city}&format=json`;
  superagent.get(url).then(returnInformation => {
    const locationData = returnInformation.body;
    const instanceOfLocation = new Location(locationData);
    res.send(instanceOfLocation);
  })
    .catch(error => console.log(error));
});


app.get('/weather', function (req, res) {
  const weatherDataArray = [];
  const weatherData = require('./data/weather.json');
  weatherData.data.forEach(instance => {
    weatherDataArray.push(new Weather(instance));
  });
  res.send(weatherDataArray);
});


function Location(location, searchQuery = 'seattle') {
  this.search_query = searchQuery;
  this.formatted_query = location.display_name;
  this.latitude = location.lat;
  this.longitude = location.lon;
}

function Weather(weather) {
  this.forecast = weather.weather.description;
  this.time = weather.valid_date;
}

app.use('*', (request, response) => {
  response.status(404).send('I am sorry, the city you have entered is invalid.');
});


app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));
