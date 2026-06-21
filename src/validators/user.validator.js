const { body } = require('express-validator');

exports.createUserValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('username').trim().isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['SUPER_ADMIN', 'ADMIN', 'RESELLER']).withMessage('Invalid role')
];

exports.updateUserValidator = [
  body('fullName').optional().trim().notEmpty(),
  body('status').optional().isIn(['ACTIVE', 'SUSPENDED']),
  body('role').optional().isIn(['SUPER_ADMIN', 'ADMIN', 'RESELLER'])
];
