const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');
const uploadController = require('./controller/uploadController');

router.post('/createPost', postController.createPost);
router.get('/getPosts', postController.getPosts);
router.post('/deletePost', postController.deletePost);
router.post('/likePost', postController.likePost); 
router.post('/upload', uploadController)

module.exports = router;
