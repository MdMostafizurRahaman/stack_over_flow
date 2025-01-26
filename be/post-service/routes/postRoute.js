const Post=require('../models/Post')
const {minioClient,BUCKET_NAME} = require('../config/minio');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const crypto=require('crypto')
const express=require('express')
const router = express.Router()
const axios=require('axios');
const { unsubscribe } = require('diagnostics_channel');

///create post
router.post('/post',authMiddleware,upload.single('codeSnippet'),async(req,res)=>{
  const { title, content,fileExtension } = req.body;
  let codeSnippetUrl = null;

  if (content && fileExtension) {
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;
    const fileBuffer = Buffer.from(content, 'utf-8');

    // Upload content-based file to MinIO
    await minioClient.putObject(BUCKET_NAME, fileName, fileBuffer);
    //codeSnippetUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${fileName}`;
    codeSnippetUrl = `http://localhost:${process.env.MINIO_PORT}/${BUCKET_NAME}/${fileName}`;
  }
  if (req.file) {
    const objectName = `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`;
    await minioClient.putObject(BUCKET_NAME, objectName, req.file.buffer);
  
    codeSnippetUrl = `http://localhost:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;

  }

  const post = new Post({ email: req.user.email, title, content, codeSnippetUrl,fileExtension }); ////confusion user table nai but paitase kothay
  await post.save();


try {
  
  const notificationServiceUrl = `http://notification-service:3002/notification/create`;


  // Perform the POST request to create a notification
  await axios.post(notificationServiceUrl, {
    email: req.user.email,
    postId: post._id,
    message: `New post: ${title}`,
    unseenBy: [req.user.email]
  });

  // Log success for debugging purposes (optional)
  console.log('Notification created successfully');
} catch (error) {
  // Log the error for debugging
  console.error('Error creating notification:', error.message);

  // Send an error response to the client if necessary
  return res.status(500).json({ message: 'Failed to create notification' });
}

  res.status(201).json({ message: 'Post created successfully' });
})

//get post of others

router.get('/post',authMiddleware, async(req,res)=>{
  const posts = await Post.find({ email: { $ne: req.user.email } });
  res.json(posts);
})

//get own post

router.get('/post/mypost',authMiddleware, async(req,res)=>{
  const posts = await Post.find({ email: { $eq: req.user.email } });
  res.json(posts);
})

//get single user post
router.get('/post/:id', authMiddleware, async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (post) {
          res.status(200).json(post);
      } else {
          res.status(404).json({ message: 'Post not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;