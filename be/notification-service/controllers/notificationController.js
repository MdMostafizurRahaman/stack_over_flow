const Notification = require('../models/Notification');

exports.getUnseenNotifications = async (req, res) => {
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
};

exports.markNotificationAsSeen = async (req, res) => {
  if (!req.user || !req.user.email) {
    console.log('Unauthorized request: No user email in token');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { postId } = req.body;
  const userEmail = req.user.email;

  try {
    const result = await Notification.updateOne(
      { _id: postId },
      { $pull: { unseenBy: userEmail } }
    );
    console.log('Notification marked as seen:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error marking notification as seen:', error);
    res.status(500).json({ message: 'Error marking notification as seen', error });
  }
};
