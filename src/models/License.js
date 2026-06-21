const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['RESELLER_1_YEAR', 'USER_30_DAYS', 'USER_1_YEAR'] },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'DISABLED'], default: 'ACTIVE' },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
