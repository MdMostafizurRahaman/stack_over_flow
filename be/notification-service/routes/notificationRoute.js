const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// Get unseen notifications for the user
router.get('/unseen', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.email) {
    console.log('Unauthorized request: No user email in token');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userEmail = req.user.email;
  console.log('Fetching notifications for:', userEmail);

  try {
    const notifications = await Notification.find({ unseenBy: userEmail });
    console.log('Notifications fetched:', notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// Mark a specific notification as seen
router.post('/markSeen', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.email) {
    console.log('Unauthorized request: No user email in token');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { notificationId } = req.body;
  const userEmail = req.user.email;

  try {
    const result = await Notification.updateOne(
      { _id: notificationId },
      { $pull: { unseenBy: userEmail } } // Remove user from unseenBy array
    );
    console.log('Notification marked as seen:', result);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Notification not found or already seen.' });
    }
    res.status(200).json({ message: 'Notification marked as seen successfully.' });
  } catch (error) {
    console.error('Error marking notification as seen:', error);
    res.status(500).json({ message: 'Error marking notification as seen', error });
  }
});

// Create a new notification
router.post('/create', async (req, res) => {
  try {
    const { email, postId, message, unseenBy } = req.body;

    // Create and save the notification
    const notification = new Notification({
      email,
      postId,
      message,
      unseenBy, // Add the user to the unseenBy array
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully.',
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
