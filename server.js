
'use strict';


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.error(error));

app.use(cors());

app.get('/location', function (req, res) {
  client.query('SELECT * FROM location WHERE search_query=$1', [req.query.city])
    .then(data => {
      if (data.rows.length > 0) {
        res.send(data.rows[0]);
      } else {
        const GEOCODE_API_KEY = process.env.GEOCODE_API;
        const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${req.query.city}&format=json`;

        superagent.get(url).then(returnInformation => {
          const locationData = returnInformation.body[0];
          const instanceOfLocation = new Location(locationData, req.query.city);
          client.query(
            `INSERT INTO location
          (search_query, formatted_query, latitude, longitude)
          VALUES ($1, $2, $3, $4)`, [req.query.city, instanceOfLocation.formatted_query, instanceOfLocation.latitude, instanceOfLocation.longitude])
            .then(() => {
              res.send(instanceOfLocation);

            });

        });
      }
    }).catch(error => {
      res.status(500).send('I am sorry, something has gone wrong');
      console.log(error);
    });
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
      const weatherData = returnInformation.body.data;
      const weatherDataArray = weatherData.map(instance => new Weather(instance));
      res.send(weatherDataArray);
    }).catch(error => {
      res.status(500).send('I am sorry, something has gone wrong');
      console.log(error);
    });
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
      const trailData = returnInformation.body.trails;
      const trailDataArray = trailData.map(instance => new Trail(instance));
      res.send(trailDataArray);
    }).catch(error => {
      res.status(500).send('I am sorry, something has gone wrong');
      console.log(error);
    });
});

app.get('/movies', function (req, res) {
  const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
  superagent.get('https://api.themoviedb.org/3/search/movie')
    .query({
      api_key: MOVIE_API_KEY,
      language: 'en-US',
      page : '1',
      query: req.query.search_query
    })
    .then(returnInformation => {
      const movieData = returnInformation.body.results;
      const movieDataArray = movieData.map(instance => new Movie(instance));
      res.send(movieDataArray);
    }).catch(error => {
      res.status(500).send('I am sorry, something has gone wrong');
      console.log(error);
    });
});

app.get('/yelp', function (req, res) {
  const YELP_API_KEY = process.env.YELP_API_KEY;
  superagent.get('https://api.yelp.com/v3/businesses/search')
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .query({
      term: 'restaurants',
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      limit: '20',
    })
    .then(returnInformation => {
      const yelpData = returnInformation.body.businesses;
      const yelpDataArray = yelpData.map(instance => new Restaurant(instance));
      if( req.query.page === '1'){
        res.send(yelpDataArray.slice(0,5));
      } else if(req.query.page === '2'){
        console.log('hello');
        res.send(yelpDataArray.slice(5,10));
      } else if(req.query.page === '3'){
        res.send(yelpDataArray.slice(10,15));
      } else {
        res.send(yelpDataArray.slice(15,20));
      }
    }).catch(error => {
      res.status(500).send('I am sorry, something has gone wrong');
      console.log(error);
    });
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

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails || 'None Reported';
  this.condition_date = trail.conditionDate.substring(1, 10);
  this.condition_time = trail.conditionDate.substring(10);
  this.star_votes = trail.starVotes;
}

function Movie(movie) {
  this.title = movie.original_title;
  this. overview = movie.overview;
  this. average_votes = movie.vote_average;
  this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;
}

function Restaurant(restaurant){
  this.name = restaurant.name || 'Not Listed';
  this.image_url = restaurant.image_url || 'Not Listed';
  this.price = restaurant.price || 'Not Listed';
  this.rating = restaurant.rating || 'Not Listed';
  this.url = restaurant.url || 'Not Listed';
}


app.use('*', (request, response) => {
  response.status(404).send('I am sorry, the city you have entered is invalid.');
});


client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));
  })
  .catch(error => console.error(error));

