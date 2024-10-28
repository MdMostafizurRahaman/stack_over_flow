// const express = require('express');
// const Notification = require('../models/Notification');
// const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware
// const router = express.Router();

// // Route to fetch unseen notifications for the current user
// router.get('/notification', authMiddleware, async (req, res) => {
//   const userEmail = req.user.email;

//   try {
//     const notifications = await Notification.find({ unseenBy: userEmail });
//     await Notification.updateMany(
//       { unseenBy: userEmail },
//       { $pull: { unseenBy: userEmail } }
//     );
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching notifications', error });
//   }
// });

// // Route to mark a specific notification as seen for the user
// router.post('/notification/markSeen', authMiddleware, async (req, res) => {
//   const { postId } = req.body;
//   const userEmail = req.user.email;

//   try {
//     await Notification.updateMany(
//       { postId, unseenBy: userEmail },
//       { $pull: { unseenBy: userEmail } }
//     );
//     res.status(200).json({ message: 'Notification marked as seen' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error marking notification', error });
//   }
// });













// module.exports = router;
// const express = require('express');
// const Notification = require('../models/Notification');
// const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware
// const router = express.Router();

// // Route to fetch unseen notifications for the current user
// router.get('/notification', authMiddleware, async (req, res) => {
//   const userEmail = req.user.email;

//   try {
//     // Fetch unseen notifications for the user
//     const notifications = await Notification.find({ unseenBy: userEmail });

//     // Optionally, you might want to consider limiting the number of notifications returned
//     // const notifications = await Notification.find({ unseenBy: userEmail }).limit(50);

//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ message: 'Error fetching notifications', error: error.message });
//   }
// });

// // Route to mark a specific notification as seen for the user
// router.post('/notification/markSeen', authMiddleware, async (req, res) => {
//   const { postId } = req.body;
//   const userEmail = req.user.email;

//   try {
//     const result = await Notification.updateMany(
//       { postId, unseenBy: userEmail },
//       { $pull: { unseenBy: userEmail } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ message: 'No notifications found to mark as seen' });
//     }

//     res.status(200).json({ message: 'Notification marked as seen' });
//   } catch (error) {
//     console.error("Error marking notification as seen:", error);
//     res.status(500).json({ message: 'Error marking notification', error: error.message });
//   }
// });

// module.exports = router;













const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// Route to fetch unseen notifications for the current user
router.get('/notification', authMiddleware, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const notifications = await Notification.find({ unseenBy: userEmail });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// Route to mark a specific notification as seen for the user
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
