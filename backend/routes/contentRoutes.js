//initialize express and Router
const express = require('express');
const router = express.Router();
//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the controller
const contentController = require("../controllers/contentController");

router.post("/room", authenticateToken, contentController.createContentRoom);

module.exports = router;