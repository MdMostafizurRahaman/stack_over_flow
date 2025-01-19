const Notification = require('../models/Notification');

exports.getUnseenNotifications = async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userEmail = req.user.email;

  try {
    const notifications = await Notification.find({ unseenBy: userEmail });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

exports.markNotificationAsSeen = async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { postId } = req.body;
  const userEmail = req.user.email;

  try {
    // Pull the user from the unseenBy array for that specific notification
    const result = await Notification.updateOne(
      { _id: postId },
      { $pull: { unseenBy: userEmail } }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as seen', error });
  }
};