const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../controllers/postController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/post', authMiddleware, async (req, res) => {
  try {
    console.log('Authenticated User:', req.user); // Debug
    const myPosts = req.query.myPosts === 'true';
    const posts = myPosts ? await Post.find({ user: req.user._id }) : await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts.' });
  }
});

router.post('/post', authMiddleware, createPost);

module.exports = router;