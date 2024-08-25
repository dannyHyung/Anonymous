const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../s3Service');

const router = express.Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

// Define the route for file uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const result = await uploadFile(file);
    res.status(200).json({ url: result.Location });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
