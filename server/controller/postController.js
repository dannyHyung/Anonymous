const db = require('../db');
const { deleteFile } = require('../s3Service');

exports.createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        console.log('Creating post with content:', content, 'and image:', image);
        const result = await db.query(
            'INSERT INTO posts (content, image, likes, comments, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [content, image, 0, [], new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating post:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getPosts = async (req, res) => {
    try {
        console.log('Fetching posts');
        const result = await db.query('SELECT * FROM posts ORDER BY date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).send('Server error');
    }
};

exports.deletePost = async (req, res) => {
    try {
      const { postId } = req.body;
      
      // Retrieve the post to get the image URL
      const postResult = await db.query('SELECT * FROM posts WHERE post_id = $1', [postId]);
      const post = postResult.rows[0];
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Delete the post from the database
      await db.query('DELETE FROM posts WHERE post_id = $1', [postId]);
  
      // If the post has an image and it is from S3, delete it from S3
      if (post.image) {
        const s3BucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        if (post.image.startsWith(s3BucketUrl)) {
          const imageKey = post.image.replace(s3BucketUrl, ''); // Extract the key from the URL
          await deleteFile(imageKey);
        }
      }
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error('Error deleting post:', err.message);
      res.status(500).send('Server error');
    }
  };

