const express = require('express');
const authMiddleware = require('../controllers/authMiddleware'); 
const notificationController = require('../controllers/notificationController');
const router = express.Router();

// To retrieve notifications that are unseen by the authenticated user
router.get('/unseen', authMiddleware, notificationController.getUnseenNotifications);

// To update a notification to mark it as seen by removing the user's email from the unseenBy list
router.post('/markSeen', authMiddleware, notificationController.markNotificationAsSeen);

module.exports = router;