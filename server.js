
'use strict';


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.error(error));

app.get('/location', function (req, res) {
  const GEOCODE_API_KEY = process.env.GEOCODE_API;
  const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${req.query.city}&format=json`;
  superagent.get(url).then(returnInformation => {
    const locationData = returnInformation.body[0];
    const instanceOfLocation = new Location(locationData,req.query.city);
    res.send(instanceOfLocation);
  })
    .catch(error => console.log(error));
});


app.get('/weather', function (req, res) {
  const WEATHER_API_KEY = process.env.WEATHER_API;
  superagent.get('https://api.weatherbit.io/v2.0/forecast/daily')
    .query({
      key: WEATHER_API_KEY,
      lat: req.query.latitude,
      lon: req.query.longitude,
      days: 8
    })
    .then(returnInformation => {
      const weatherData = returnInformation.body;
      const weatherDataArray = weatherData.data.map(instance => new Weather(instance));
      res.send(weatherDataArray);
    }).catch(error => console.log(error));
});

app.get('/trails', function (req, res) {
  const TRAIL_API_KEY = process.env.TRAIL_API;
  superagent.get('https://www.hikingproject.com/data/get-trails')
    .query({
      key: TRAIL_API_KEY,
      lat: req.query.latitude,
      lon: req.query.longitude,
    })
    .then(returnInformation => {
      const trailData = returnInformation.body;
      const trailDataArray = trailData.trails.map(instance => new Trail(instance));
      res.send(trailDataArray);
    }).catch(error => console.log(error));
});



function Location(location, search_query) {
  this.search_query = search_query || 'seattle';
  this.formatted_query = location.display_name;
  this.latitude = location.lat;
  this.longitude = location.lon;
}

function Weather(weather) {
  this.forecast = weather.weather.description;
  this.time = weather.valid_date;
}

function Trail(trail){
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.summary = trail.summary;
  this. trail_url = trail.url;
  this.conditions = trail.conditionDetails || 'None Reported';
  this.condition_date = trail.conditionDate.substring(1,10);
  this.condition_time = trail.conditionDate.substring(10);
  this.star_votes = trail.starVotes;
}

app.use('*', (request, response) => {
  response.status(404).send('I am sorry, the city you have entered is invalid.');
});


app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));
