const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', auth, role(['SUPER_ADMIN', 'ADMIN']), userController.getUsers);
router.get('/:id', auth, role(['SUPER_ADMIN', 'ADMIN']), userController.getUserById);
router.post('/', auth, role(['SUPER_ADMIN']), createUserValidator, validate, audit('CREATE_USER'), userController.createUser);
router.put('/:id', auth, role(['SUPER_ADMIN', 'ADMIN']), updateUserValidator, validate, audit('UPDATE_USER'), userController.updateUser);
router.delete('/:id', auth, role(['SUPER_ADMIN']), audit('DELETE_USER'), userController.deleteUser);

module.exports = router;
