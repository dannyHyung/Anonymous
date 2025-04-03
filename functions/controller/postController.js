const { db, storage, admin } = require('../firebaseConfig');
const { saveExternalImage } = require('../utils/imageUtils');

exports.createPost = async (req, res) => {
  try {
    const { content, image, mediaType } = req.body;
    console.log('Creating post with content:', content, 'media:', image, 'type:', mediaType);
    const postData = {
      content,
      image,
      mediaType: mediaType || 'image',
      likes: 0,
      likedBy: [],
      comments: [],
      date: new Date(),
      userId: req.user.uid,
      userDisplayName: req.user.name || req.user.email.split('@')[0]
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
    const userId = req.user.uid;

    // Admin SDK syntax
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = postDoc.data();

    // Check if user owns the post
    if (postData.userId && postData.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

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
    const userId = req.user.uid;

    // Admin SDK syntax
    const postRef = db.collection('posts').doc(postId);

    // First check if the post exists
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get current data
    const postData = postDoc.data();
    const currentLikes = postData.likes || 0;
    const likedBy = postData.likedBy || [];

    // Check if user already liked the post
    const userIndex = likedBy.indexOf(userId);
    let updatedLikes, updatedLikedBy;

    if (userIndex === -1) {
      // User hasn't liked the post yet - add like
      updatedLikes = currentLikes + 1;
      updatedLikedBy = [...likedBy, userId];
    } else {
      // User already liked the post - remove like
      updatedLikes = Math.max(0, currentLikes - 1); // Prevent negative likes
      updatedLikedBy = [...likedBy];
      updatedLikedBy.splice(userIndex, 1);
    }

    // Use a regular update instead of a transaction
    await postRef.update({
      likes: updatedLikes,
      likedBy: updatedLikedBy
    });

    // Get updated document
    const updatedDoc = await postRef.get();

    res.status(200).json({
      post_id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (err) {
    console.error('Error toggling post like:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.uid;

    const newComment = {
      text,
      userId: userId,
      userDisplayName: req.user.name || req.user.email.split('@')[0],
      date: new Date().toISOString()
    };

    const postRef = db.collection('posts').doc(postId);
    
    // Check if post exists
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get current comments and append new one
    const currentComments = postDoc.data().comments || [];
    const updatedComments = [...currentComments, newComment];

    // Update directly without transaction
    await postRef.update({ comments: updatedComments });

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).send('Server error');
  }
};
