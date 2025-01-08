const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const Post = require('../models/Post'); 
const Notification = require('../models/Notification'); 
const { minioClient, BUCKET_NAME } = require('../config/minio');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/post', authMiddleware, upload.single('codeSnippet'), async (req, res) => {
  try {
    const { title, content, language, folderName } = req.body;
    let codeSnippetUrl = null;

    if (req.file) {
      const objectName = `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`;
      await minioClient.putObject(BUCKET_NAME, objectName, req.file.buffer);
      codeSnippetUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
    }

    if (!title || (!content && !codeSnippetUrl)) {
      return res.status(400).json({ message: 'Title and either content or file are required' });
    }

    const post = new Post({ 
      email: req.user.email, 
      title, 
      content, 
      codeSnippetUrl, 
      language, 
      folderName 
    });
    await post.save();

    const users = await User.find(); 
    if (users.length === 0) {
      console.warn("No users found to notify");
    } else {
      const notifications = users.map(user => ({
        email: user.email,
        postId: post._id,
        message: `New post created by ${req.user.email}: ${title}`,
        unseenBy: [user.email],
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error("Error creating post:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Get posts based on query parameter (myPosts)
router.get('/post', authMiddleware, async (req, res) => {
  const { myPosts } = req.query; // Get the myPosts query parameter

  let filter = {};
  if (myPosts === 'true') {
    filter = { email: req.user.email };  // Fetch user's posts
  } else if (myPosts === 'false' || myPosts === undefined) {
    filter = { email: { $ne: req.user.email } };  // Fetch posts by others
  }

  try {
    const posts = await Post.find(filter);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/post/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) res.status(200).json(post);
    else res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
