const fetch = require('node-fetch');
const { storage } = require('../firebaseConfig');

/**
 * Downloads an image from a URL and uploads it to Firebase Storage
 */
const saveExternalImage = async (imageUrl) => {
  try {
    // Skip if already a Firebase URL
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      return imageUrl;
    }
    
    console.log('Downloading external image:', imageUrl);
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    // Get the image data
    const buffer = await response.arrayBuffer();
    
    // Generate a unique filename
    const fileExtension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
    const fileName = `uploads/external_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Upload to Firebase Storage
    const file = storage.file(fileName);
    
    console.log('Uploading to Firebase Storage');
    await file.save(Buffer.from(buffer), {
      metadata: {
        contentType: response.headers.get('content-type') || `image/${fileExtension}`
      }
    });
    
    // Make it publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const downloadURL = `https://storage.googleapis.com/${storage.name}/${fileName}`;
    console.log('Image saved to Firebase:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error saving external image:', error);
    // Return original URL as fallback
    return imageUrl;
  }
};

module.exports = {
  saveExternalImage
};