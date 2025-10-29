//initialize express and Router
const express = require('express');
const router = express.Router();

//get the authenticate controller
const authController = require('../controllers/authController');

//routes of authentication
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;