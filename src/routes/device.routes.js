const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', auth, role(['SUPER_ADMIN', 'ADMIN']), deviceController.getDevices);
router.get('/:id', auth, role(['SUPER_ADMIN', 'ADMIN']), deviceController.getDeviceById);
router.put('/:id', auth, role(['SUPER_ADMIN', 'ADMIN']), audit('UPDATE_DEVICE'), deviceController.updateDevice);
router.delete('/:id', auth, role(['SUPER_ADMIN']), audit('DELETE_DEVICE'), deviceController.deleteDevice);

module.exports = router;
