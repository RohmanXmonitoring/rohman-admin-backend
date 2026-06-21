const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/', auth, role(['SUPER_ADMIN']), auditController.getAuditLogs);

module.exports = router;
