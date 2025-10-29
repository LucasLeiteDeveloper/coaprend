//import Express's module
const express = require('express');
//initializes the app
const app = express();
//get the authenticateToken middleware
const authenticateToken = require('./middlewares/authenticateToken');
//get the authenticate controller
const authRoutes = require('./routes/authRoutes');

//configure the dotenv's variables, making they usable
require('dotenv').config();
const { DOOR } = require('./config/config');

//configure the express to use JSON
app.use(express.json());
//configure the app routes of authentication to /api
app.use('/api', authenticateToken, authRoutes);

//starts the application
app.listen(DOOR, () => {
    console.log(`server running at http://localhost:${DOOR}`)
})