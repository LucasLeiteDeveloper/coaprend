//initialize express and Router
const express = require('express');
const router = express.Router();
//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the controller
const contentController = require("../controllers/contentController");

// route of rooms
router.post("/room", authenticateToken, contentController.createContentRoom);
router.patch('/room/:roomId', authenticateToken, contentController.updateRoom);

// posts routes
router.post("/posts", authenticateToken, contentController.createPost);
router.patch("/posts/:postId", authenticateToken, contentController.updatePost);
router.get("/posts/search", authenticateToken, contentController.searchGlobalPosts);
router.get("room/:roomid/posts", authenticateToken, contentController.getPostsForRoom);


// tasks routes
router.post("/tasks", authenticateToken, contentController.createTask);
router.patch("/tasks/:taskId", authenticateToken, contentController.updateTask);
router.get("/room/:roomId/tasks", authenticateToken, contentController.getTasksForRoom);

module.exports = router;