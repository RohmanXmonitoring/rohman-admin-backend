const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/', auth, role(['SUPER_ADMIN', 'ADMIN']), notificationController.getNotifications);
router.post('/', auth, role(['SUPER_ADMIN', 'ADMIN']), notificationController.sendNotification);

module.exports = router;
