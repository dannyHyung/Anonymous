const { db } = require('../firebaseConfig');
const { 
  collection, addDoc, getDocs, doc, deleteDoc, 
  updateDoc, arrayUnion, query, orderBy, getDoc, increment 
} = require('firebase/firestore');
const { deleteObject, ref } = require('firebase/storage');
const { storage } = require('../firebaseConfig');

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    console.log('Creating post with content:', content, 'and image:', image);
    
    const postData = {
      content,
      image,
      likes: 0,
      comments: [],
      date: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'posts'), postData);
    
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
    const postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        post_id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const postData = postSnap.data();
    await deleteDoc(postRef);
    
    if (postData.image && postData.image.includes('firebase')) {
      const imageUrl = new URL(postData.image);
      const imagePath = decodeURIComponent(imageUrl.pathname.split('/o/')[1].split('?')[0]);
      
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
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
    
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await updateDoc(postRef, {
      likes: increment(1)
    });
    
    const updatedPostSnap = await getDoc(postRef);
    
    res.status(200).json({
      post_id: updatedPostSnap.id,
      ...updatedPostSnap.data()
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
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(newComment)
    });
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).send('Server error');
  }
};