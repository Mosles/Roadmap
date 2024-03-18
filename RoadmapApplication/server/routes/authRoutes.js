// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { userValidationRules, validate } = require('../middleware/validation');

router.post('/register', userValidationRules(), validate, authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/user', protect, authController.getUserDetails);
router.post('/roadmaps', protect, authController.createRoadmap);
router.get('/roadmaps', protect, authController.getRoadmaps);
router.post('/tasks', protect, authController.createTask);
router.get('/roadmaps/:roadmapId/tasks', protect, authController.getTasksByRoadmap);
router.put('/tasks/:taskId/status', protect, authController.updateTaskStatus);
router.post('/comments', protect, authController.createComment);
router.get('/tasks/:taskId/comments', protect, authController.getCommentsByTask);
router.post('/roadmaps/:roadmapId/reset', protect, authController.resetRoadmap);
router.post('/roadmaps/:roadmapId/clear-reset', protect, authController.clearResetFlag);
router.post('/roadmaps/:roadmapId/archive', protect, authController.archive);
// Add this new route
router.get('/validate', protect, (req, res) => {
    res.json({ message: "Authenticated" });
});

module.exports = router;
