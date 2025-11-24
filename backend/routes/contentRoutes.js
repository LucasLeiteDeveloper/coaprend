//initialize express and Router
const express = require('express');
const router = express.Router();
//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the controller
const contentController = require("../controllers/contentController");
const notificationContoller = require("../controllers/notificationController");

// route of rooms
router.post("/room", authenticateToken, contentController.createContentRoom);
router.patch('/room/:roomId', authenticateToken, contentController.updateRoom);
router.delete("/room/roomId", authenticateToken, contentController.deleteRoom);

// posts routes
router.post("/posts", authenticateToken, contentController.createPost);
router.patch("/posts/:postId", authenticateToken, contentController.updatePost);
router.delete("/posts/:postId", authenticateToken, contentController.deletePost);
router.get("room/:roomid/posts", authenticateToken, contentController.getPostsForRoom);
router.get("/posts/search", authenticateToken, contentController.searchGlobalPosts);
router.get("/posts/tags/search", authenticateToken, contentController.searchPostsByTags);

// tasks routes
router.post("/tasks", authenticateToken, contentController.createTask);
router.patch("/tasks/:taskId", authenticateToken, contentController.updateTask);
router.get("/room/:roomId/tasks", authenticateToken, contentController.getTasksForRoom);
router.delete("/tasks/:taskId", authenticateToken, contentController.deleteTask);

// notification routes
router.get("/notifications", authenticateToken, notificationContoller.getMyNotifications);
router.get("/notifications/:id/read", authenticateToken, notificationContoller.markAsRead);

module.exports = router;