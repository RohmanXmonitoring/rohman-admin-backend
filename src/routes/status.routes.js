const express = require('express');
const router = express.Router();
const statusController = require('../controllers/status.controller');

router.get('/status', statusController.getStatus);
router.get('/version', statusController.getVersion);
router.get('/system-info', statusController.getSystemInfo);

module.exports = router;
