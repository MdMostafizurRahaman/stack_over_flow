const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// To retrieve notifications that are unseen by the authenticated user
router.get('/notification', authMiddleware, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const notifications = await Notification.find({ unseenBy: userEmail });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

//To update a notification to mark it as seen by removing the user's email from the unseenBy list
router.post('/notification/markSeen', authMiddleware, async (req, res) => {
  const { postId } = req.body;
  const userEmail = req.user.email;

  try {
    // Pull the user from the unseenBy array for that specific notification
    const result = await Notification.updateOne(
      { postId, unseenBy: userEmail },
      { $pull: { unseenBy: userEmail } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Notification not found or already seen' });
    }

    res.status(200).json({ message: 'Notification marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification', error });
  }
});

module.exports = router;
