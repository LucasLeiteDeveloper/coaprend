//initialize express and Router
const express = require('express');
const router = express.Router();
//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the controller
const contentController = require("../controllers/contentController");

// route of rooms
router.post("/room", authenticateToken, contentController.createContentRoom);

// posts routes
router.post("/posts", authenticateToken, contentController.createPost);
router.get("/rooms/:roomId/posts", authenticateToken, contentController.getPostsForRoom);

// tasks routes
router.post("/tasks", authenticateToken, contentController.createTask);
router.get("/rooms/:roomId/tasks", authenticateToken, contentController.getTasksForRoom);

module.exports = router;