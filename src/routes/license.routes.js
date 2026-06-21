const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/license.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', auth, role(['SUPER_ADMIN', 'ADMIN']), licenseController.getLicenses);
router.post('/', auth, role(['SUPER_ADMIN']), audit('CREATE_LICENSE'), licenseController.createLicense);
router.put('/:id', auth, role(['SUPER_ADMIN']), audit('UPDATE_LICENSE'), licenseController.updateLicense);
router.delete('/:id', auth, role(['SUPER_ADMIN']), audit('DELETE_LICENSE'), licenseController.deleteLicense);

module.exports = router;
