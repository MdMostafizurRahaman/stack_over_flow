const crypto = require('crypto');
const Post = require('../models/Post'); 
const Notification = require('../models/Notification'); 
const { minioClient, BUCKET_NAME } = require('../config/minio');
const User = require('../models/User'); 

exports.createPost = async (req, res) => {
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
      title,
      content,
      language,
      folderName,
      codeSnippetUrl,
      createdBy: req.user._id
    });

    await post.save();

    // Notify followers
    const followers = await User.find({ following: req.user._id });
    const notifications = followers.map(follower => ({
      userId: follower._id,
      postId: post._id,
      unseenBy: [follower.email]
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};