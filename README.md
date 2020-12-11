# city_explorer_api


**Author**: James Gerstenberger
**Version**: 1.0.2 

## Overview
The City Explorer is a web page that allows the user to input a city and in turn receive geographic information such as a map and latitude and longitude. The explorer app also returns weather data, hiking trail data, and restaurant information for the location

## Getting Started
To get this app running one must create a backend platform that will intake a city search query and return the above specified information

## Architecture
This program is utilizing JavaScript and API calls to yelp, locationIQ, Hiking Project, and WeatherBit to retrieve information. It is employing Heroku, Node.js, express, dotenv, and cors to run. The application also utilizes postgres SQL database to cache location information for previously queried cities to minimize future API calls.

## Change Log

12-07-2020 5:30pm - Application is now heroku deployed app able to be utilized as backend for City Explorer frontend webpage. Deployed app is able to intak a query and return pre-populated information from .json files.

12-08-2020 5:00pm - Application now utilizes API calls to populate location information which in turn is utilized for API calls to retrieve weather and hiking information.

12-07-2020 4:30pm - Application now utilizes Postgres SQL to store location information of previously queried cities for future use to minimize API calls

 ## Credits and Collaborations
Codefellows TA's Bade, Brai, Chance, Skyler, and Ashlyn
Fellow Students Nick Abramowicz, Alan Hung, William Moreno, Nick Magruder


Number and name of feature: Day 1: 4 features; Deployed Heroku App, location constructor and path, weather constructor and path, error message on invalid query.

Estimate of time needed to complete: 6 hours

Start time: 2:00PM

Finish time: 5:30PM

Actual time needed to complete: 3.5 Hours

Number and name of feature: Day 2: 4 features; Utilize .map for object iteration, connect location query with API to Location IQ, Weatherbit and Hiking Project.

Estimate of time needed to complete: 5 hours

Start time: 2:00PM

Finish time: 5:00PM

Actual time needed to complete: 3 Hours

Number and name of feature: Day 3: 2 features; Create local postgres database and schema.sql file for table creation to store queried city location information and then link to Heroku postgress database to create deployed site with SQL database capabilities

Estimate of time needed to complete: 4 hours

Start time: 2:00PM

Finish time: 4:30PM

Actual time needed to complete: 2.5 Hours

Number and name of feature: Day 4: 3 features; Add API calls for movies, add API calls for yelp, and create pagination for yelp results

Estimate of time needed to complete: 4 hours

Start time: 2:00PM

Finish time: 6:15PM

Actual time needed to complete: 4.25 Hours
