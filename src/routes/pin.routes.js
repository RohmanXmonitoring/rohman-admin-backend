const express = require('express');
const router = express.Router();
const pinController = require('../controllers/pin.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', auth, role(['SUPER_ADMIN', 'ADMIN']), pinController.getPins);
router.post('/', auth, role(['SUPER_ADMIN']), audit('GENERATE_PIN'), pinController.generatePin);
router.delete('/:id', auth, role(['SUPER_ADMIN']), audit('DELETE_PIN'), pinController.deletePin);

module.exports = router;
