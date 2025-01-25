const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  codeSnippetUrl: { type: String },
  language: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added user field
});

module.exports = mongoose.model('Post', postSchema);
