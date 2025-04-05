const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');
const { authenticateUser } = require('./middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Use memoryStorage explicitly
const { storage } = require('./firebaseConfig');

// Public routes
router.get('/getPosts', postController.getPosts);

// Protected routes
router.post('/createPost', authenticateUser, postController.createPost);
router.post('/deletePost', authenticateUser, postController.deletePost);
router.post('/likePost', authenticateUser, postController.likePost);
router.post('/addComment', authenticateUser, postController.addComment);

module.exports = router;
