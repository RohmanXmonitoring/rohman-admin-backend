const Notification = require('../models/Notification');
const admin = require('firebase-admin');
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

    const notification = new Notification({
      title,
      message,
      target,
      targetId,
      senderId: req.user.userId
    });

    await notification.save();

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
          notificationId: notification._id.toString()
        }
      };

      if (target === 'ALL') {
        fcmMessage.topic = 'all_users';
      } else if (target === 'ROLE') {
        fcmMessage.topic = `role_${targetId.toLowerCase()}`;
      } else if (target === 'USER') {
        // Find user to get their fcmToken
        const user = await User.findById(targetId);
        if (user && user.fcmToken) {
          fcmMessage.token = user.fcmToken;
        } else {
          throw new Error('User not found or has no FCM token');
        }
      }

      if (fcmMessage.topic || fcmMessage.token) {
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
