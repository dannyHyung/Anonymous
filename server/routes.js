const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');

router.post('/posts', postController.createPost);
router.get('/posts', postController.getPosts);

module.exports = router;
