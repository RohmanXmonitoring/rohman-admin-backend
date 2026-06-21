const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');

router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.getMe);

module.exports = router;
