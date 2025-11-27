//initialize express and Router
const express = require('express');
const router = express.Router();
//get the authenticateToken 
const authenticateToken = require("../middlewares/authenticateToken");
//get the controller
const classController = require("../controllers/classController");
const contentController = require("../controllers/contentController");
const upload = require("../middlewares/uploadMiddleware");
const notificationContoller = require("../controllers/notificationController");

// route of classes 
router.get("/classes/my", authenticateToken, classController.getUserClasses);
router.get("/class/:classId", authenticateToken, classController.getClassDetails);
router.post("/class", authenticateToken, upload.single('icon'), classController.createClass);
router.post("/class/enter", authenticateToken, classController.enterClass);
router.patch("/class/:classId", authenticateToken, classController.updateClass);
router.delete("/class/:classId", authenticateToken, classController.deleteClass);

// posts routes
router.post("/posts", authenticateToken, contentController.createPost);
router.patch("/posts/:postId", authenticateToken, contentController.updatePost);
router.delete("/posts/:postId", authenticateToken, contentController.deletePost);
router.get("/class/:classId/posts", authenticateToken, contentController.getPostsForClass);
router.get("/posts/search", authenticateToken, contentController.searchGlobalPosts);
router.get("/posts/tags/search", authenticateToken, contentController.searchPostsByTags);

// tasks routes
router.post("/tasks", authenticateToken, contentController.createTask);
router.patch("/tasks/:taskId", authenticateToken, contentController.updateTask);
router.get("/class/:classId/tasks", authenticateToken, contentController.getTasksForClass);
router.delete("/tasks/:taskId", authenticateToken, contentController.deleteTask);

// notification routes
router.get("/notifications", authenticateToken, notificationContoller.getMyNotifications);
router.get("/notifications/:id/read", authenticateToken, notificationContoller.markAsRead);

module.exports = router;