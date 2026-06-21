const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/', auth, role(['SUPER_ADMIN']), settingsController.getSettings);
router.post('/', auth, role(['SUPER_ADMIN']), settingsController.updateSetting);

module.exports = router;
