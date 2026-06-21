const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const deviceRoutes = require('./device.routes');
const licenseRoutes = require('./license.routes');
const pinRoutes = require('./pin.routes');
const notificationRoutes = require('./notification.routes');
const statusRoutes = require('./status.routes');
const auditRoutes = require('./audit.routes');
const dashboardRoutes = require('./dashboard.routes');
const settingsRoutes = require('./settings.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/licenses', licenseRoutes);
router.use('/pins', pinRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/', statusRoutes);

module.exports = router;
