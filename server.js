
'use strict';


const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

app.get('/location', function(req, res){
    const locationData = require('./data/location.json');
    const instanceOfLocation = new Location(locationData[0]);
    res.send(instanceOfLocation);
});

const weatherDataArray = [];
app.get('/weather', function(req, res){
    const weatherData = require('./data/weather.json');
    weatherData.data.forEach(instance=> {
        weatherDataArray.push(new Weather(instance));
    });
    res.send(weatherDataArray);
});



function Location(location, searchQuery = "seattle"){
    this.search_query = searchQuery;
    this.formatted_query = location.display_name;
    this.latitude = location.lat;
    this.longitude = location.lon;
}

function Weather(weather){
    this.forecast = weather.weather.description;
    this.time = weather.valid_date;
}

app.use('*', (request, response) => {
    response.status(404).send('I am sorry, the city you have entered is invalid.');
  });


app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));