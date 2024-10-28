const Post=require('../models/Post')
const Notification = require('../models/Notification');
const {minioClient,BUCKET_NAME} = require('../config/minio');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const crypto=require('crypto')
const express=require('express')
const router = express.Router()

///create post
router.post('/post',authMiddleware,upload.single('codeSnippet'),async(req,res)=>{
  const { title, content } = req.body;
  let codeSnippetUrl = null;

  if (req.file) {
    const objectName = `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`;
    await minioClient.putObject(BUCKET_NAME, objectName, req.file.buffer);
    // codeSnippetUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
    codeSnippetUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;

  }

  const post = new Post({ email: req.user.email, title, content, codeSnippetUrl });
  await post.save();

  const notification = new Notification({
    email: req.user.email,
    postId: post._id,
    message: `New post: ${title}`,
  });
  await notification.save();

  res.status(201).json({ message: 'Post created successfully' });
})

//get post of others

router.get('/post',authMiddleware, async(req,res)=>{
  const posts = await Post.find({ email: { $ne: req.user.email } });
  res.json(posts);
})

//get own post

router.get('/mypost',authMiddleware, async(req,res)=>{
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