const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');

router.post('/createPost', postController.createPost);
router.get('/getPosts', postController.getPosts);
router.post('/deletePost', postController.deletePost);

module.exports = router;
