
'use strict';


const express = require('express');
const cors = require('cors'); // Cross origin resource sharing - allow a frontend running from your computer to access a backend on your computer
require('dotenv').config(); // configures variables from `.env`
// npm install dotenv -S
// npm i dotenv -S

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.static('./public'));

// app.get("/home", function(req, res){
//     res.send("./index.html");
// });

app.get('/location', function(req, res){
    const locationData = require('./data/location.json');
    console.log(locationData);
    const instanceOfLocation = new Location(locationData[0]);
    console.log (instanceOfLocation);
    res.send(instanceOfLocation);
});

    // const locationData = require('./data/location.json')}.then(parse =>{ 
    //     console.log(locationData);
    //     parse.forEach(locationObject => new Location (locationData));
    //     // const instanceOfLocation = new Location(locationData);
    //     console.log(Location);
    //     res.send(instanceOfLocation);
    // })


function Location(location, searchQuery = "seattle"){
    this.search_query = searchQuery;
    this.formatted_query = location.display_name;
    this.latitude = location.lat;
    this.longitude = location.lon;
}


app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));