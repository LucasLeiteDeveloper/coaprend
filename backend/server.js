//import Express's module
const express = require('express');
//import the CORS package
const cors = require('cors');
//initializes the app
const app = express();
//get the authenticate controller
const authRoutes = require('./routes/authRoutes');

//configure the dotenv's variables, making they usable
require('dotenv').config();
const { DOOR } = require('./config/config');

//cors configuration
app.use(cors({
    origin: '*', //apply any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', //apply any method
    allowedHeaders: 'Content-Type,Authorization' //allow headers
}))

//configure the express to use JSON
app.use(express.json());
//configure the app routes of authentication to /api
app.use('/api', authRoutes);

//starts the application
app.listen(DOOR, () => {
    console.log(`server running at http://localhost:${DOOR}`)
})