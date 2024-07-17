const db = require('../db');

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const result = await db.query(
      'INSERT INTO posts (content, image, likes, comments, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [content, image, 0, [], new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
