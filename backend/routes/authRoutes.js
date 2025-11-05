//initialize express and Router
const express = require('express');
const router = express.Router();

//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the authenticate controller
const authController = require('../controllers/authController');

//routes of authentication
router.post('/register', authController.registerUser);
//route to be called after the login
router.post('/auth/sync', authenticateToken, authController.syncProfile);

module.exports = router;