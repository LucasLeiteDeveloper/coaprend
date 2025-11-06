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
router.post('/sync', authenticateToken, authController.syncProfile);
router.get('/profile', authenticateToken, authController.getUserProfile);
//route to delete an user
router.delete('/user/me', authenticateToken, authController.deleteUserAccount);

module.exports = router;