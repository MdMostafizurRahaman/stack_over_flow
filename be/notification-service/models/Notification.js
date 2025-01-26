const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: { type: String },
  unseenBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
