const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/unseen', authMiddleware, notificationController.getUnseenNotifications);
router.post('/markSeen', authMiddleware, notificationController.markNotificationAsSeen);

module.exports = router;
