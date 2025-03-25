const express = require('express');
const multer = require('multer');
const { storage, admin } = require('../firebaseConfig');

const router = express.Router();
const upload = multer({ memory: true }); // Store files in memory

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const timestamp = Date.now();
    const fileName = `uploads/${timestamp}_${file.originalname}`;
    
    // Create a file reference
    const fileRef = storage.file(fileName);
    
    // Upload the file
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      }
    });
    
    // Make the file publicly accessible
    await fileRef.makePublic();
    
    // Get the public URL
    const downloadURL = `https://storage.googleapis.com/${storage.name}/${fileName}`;
    
    res.status(200).json({ url: downloadURL });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

module.exports = router;