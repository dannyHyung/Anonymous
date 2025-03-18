const express = require('express');
const multer = require('multer');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../firebaseConfig');

const router = express.Router();
const upload = multer({ memory: true }); // Store files in memory

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.originalname}`;
    const storageRef = ref(storage, `uploads/${fileName}`);
    
    const metadata = {
      contentType: file.mimetype,
    };
    
    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    res.status(200).json({ url: downloadURL });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;