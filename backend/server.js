//import Express's module
const express = require('express');
//initializes the app
const app = express();

//configure the dotenv's variables, making they usable
require('dotenv').config();
const { DOOR } = require('./config/config');

app.listen(DOOR, () => {
    console.log(`server running at http://localhost:${DOOR}`)
})