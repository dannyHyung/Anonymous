const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');

router.post('/createPosts', postController.createPost);
router.get('/getPosts', postController.getPosts);

module.exports = router;
