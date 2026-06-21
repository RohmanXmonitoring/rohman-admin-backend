const { body } = require('express-validator');

exports.createLicenseValidator = [
  body('userId').isMongoId().withMessage('Invalid User ID'),
  body('type').isIn(['Reseller (1 Tahun)', 'User (30 Hari)', 'User (1 Tahun)']).withMessage('Invalid license type'),
  body('expiryDate').isISO8601().withMessage('Expiry date must be a valid date (ISO8601)')
];
