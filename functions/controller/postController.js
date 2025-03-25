const { db, storage, admin } = require('../firebaseConfig');
const { saveExternalImage } = require('../utils/imageUtils');

exports.createPost = async (req, res) => {
  try {
    const { content, image, mediaType } = req.body;
    console.log('Creating post with content:', content, 'media:', image, 'type:', mediaType);
    
    // Process external image URLs
    let finalImage = image;
    
    if (mediaType === 'image' && image && image.startsWith('http') && 
        !image.includes('firebasestorage.googleapis.com')) {
      console.log('Processing external image URL');
      finalImage = await saveExternalImage(image);
    }

    const postData = {
      content,
      image: finalImage,
      mediaType: mediaType || 'image',
      likes: 0,
      comments: [],
      date: new Date()
    };
    
    // Admin SDK syntax
    const docRef = await db.collection('posts').add(postData);
    
    res.status(201).json({
      post_id: docRef.id,
      ...postData
    });
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    console.log('Fetching posts');
    
    // Admin SDK query syntax
    const snapshot = await db.collection('posts').orderBy('date', 'desc').get();
    
    console.log('Found documents:', snapshot.size);
    
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({
        post_id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    // Admin SDK syntax
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const postData = postDoc.data();
    await postRef.delete();
    
    // Delete image if it exists
    if (postData.image && postData.image.includes('firebase')) {
      try {
        const imageUrl = new URL(postData.image);
        const imagePath = decodeURIComponent(imageUrl.pathname.split('/o/')[1].split('?')[0]);
        
        // Admin SDK for storage
        await storage.file(imagePath).delete();
      } catch (imgErr) {
        console.error('Error deleting image:', imgErr);
        // Continue even if image deletion fails
      }
    }
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).send('Server error');
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    // Admin SDK syntax
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment likes using Admin SDK
    await postRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    });
    
    // Get updated doc
    const updatedDoc = await postRef.get();
    
    res.status(200).json({
      post_id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    
    const newComment = {
      text,
      date: new Date().toISOString()
    };
    
    // Admin SDK syntax
    const postRef = db.collection('posts').doc(postId);
    await postRef.update({
      comments: admin.firestore.FieldValue.arrayUnion(newComment)
    });
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).send('Server error');
  }
};