const db = require('../db');

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
    const { postId } = req.body;
    try {
        await db.query(`DELETE FROM posts WHERE post_id = ${postId}`);
        res.status(200).send('Post deleted successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

