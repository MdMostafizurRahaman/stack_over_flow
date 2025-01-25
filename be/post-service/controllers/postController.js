const crypto = require('crypto');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { minioClient, BUCKET_NAME } = require('../config/minio');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, language, folderName } = req.body;
    let codeSnippetUrl = null;

    // Check if req.user exists (User authentication check)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    // If a file is uploaded
    if (req.file) {
      try {
        const objectName = `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`;
        await minioClient.putObject(BUCKET_NAME, objectName, req.file.buffer);
        codeSnippetUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
      } catch (err) {
        console.error('Error uploading file to storage:', err);
        return res.status(500).json({ message: 'Error uploading file to storage.' });
      }
    }

    // Check if both title and content/codeSnippetUrl are provided
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    if (!content && !codeSnippetUrl) {
      return res.status(400).json({ message: 'Content or a file is required.' });
    }

    // Create new post in the database
    const post = new Post({
      title,
      content,
      language,
      folderName,
      codeSnippetUrl,
      user: req.user._id, // User ID from authentication
    });

    await post.save();

    // Create a notification for the new post
    const user = await User.findById(req.user._id);
    const notification = new Notification({
      email: user.email, // Use user email
      message: `New post created by ${user.email}`,
      post: post._id,
    });

    await notification.save();

    res.status(201).json(post); // Send the created post back as response
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred while creating the post.' });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    // Add filtering for user's posts if "myPosts" query is true
    const filter = req.query.myPosts === 'true' ? { user: req.user._id } : {};
    const posts = await Post.find(filter);

    res.status(200).json(posts); // Send the posts as response
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts.' });
  }
};

// Middleware for token authentication
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
  });
};
