//initialize express and Router
const express = require('express');
const router = express.Router();

//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the authenticate controller
const authController = require('../controllers/authController');

//routes of authentication
//gets the profile data
router.get('/profile', authenticateToken, authController.getUserProfile);
// update the profile
router.patch('/profile', authenticateToken, authController.updateUserProfile);
//update the settings 
router.patch("/settings", authenticateToken, authController.updateUserSettings);
// create a new profile
router.post('/register', authController.registerUser);
//route to be called after the login
router.post('/sync', authenticateToken, authController.syncProfile);
//route to delete an user
router.delete('/user/me', authenticateToken, authController.deleteUserAccount);

module.exports = router;