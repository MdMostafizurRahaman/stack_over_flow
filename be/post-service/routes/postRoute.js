const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.single('codeSnippet'), postController.createPost);

module.exports = router;