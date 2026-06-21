const { body } = require('express-validator');

exports.loginValidator = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];
