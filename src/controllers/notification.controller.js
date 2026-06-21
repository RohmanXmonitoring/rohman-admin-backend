const { Notification, User } = require('../models');
const { admin } = require('../config/firebase');
const { success, error } = require('../utils/response');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return success(res, notifications);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, target, targetId } = req.body;

    const notification = await Notification.create({
      title,
      message,
      target,
      targetId,
      senderId: req.user.userId
    });

    // Logic to send via FCM
    try {
      const fcmMessage = {
        notification: { title, body: message },
        android: {
          notification: {
            channelId: 'admin_notifications',
            priority: 'high',
            sound: 'default'
          }
        },
        data: {
          type: 'ADMIN_NOTIFICATION',
          notificationId: notification.id.toString()
        }
      };

      if (target === 'ALL') {
        fcmMessage.topic = 'all_users';
      } else if (target === 'ROLE') {
        fcmMessage.topic = `role_${targetId.toLowerCase()}`;
      } else if (target === 'USER') {
        // Find user to get their fcmToken
        const user = await User.findById(targetId).exec();
        if (user && user.fcmToken) {
          fcmMessage.token = user.fcmToken;
        } else {
          console.warn('User not found or has no FCM token for targetId:', targetId);
        }
      }

      if (admin.apps.length > 0 && (fcmMessage.topic || fcmMessage.token)) {
        await admin.messaging().send(fcmMessage);
        console.log('FCM Notification sent successfully');
      }
    } catch (fcmError) {
      console.error('FCM Error:', fcmError.message);
    }

    return success(res, notification, 'Notification sent successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};
