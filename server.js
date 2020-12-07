
'use strict';


const express = require('express');
const cors = require('cors'); // Cross origin resource sharing - allow a frontend running from your computer to access a backend on your computer
require('dotenv').config(); // configures variables from `.env`
// npm install dotenv -S
// npm i dotenv -S

const app = express();
const PORT = process.env.PORT || 3002;



app.listen(PORT, () => console.log(`server is up on port: ${PORT}`));