const mongoose = require('mongoose');

const enrollmentPinSchema = new mongoose.Schema({
  pinCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ['ACTIVE', 'DISABLED', 'EXPIRED'], default: 'ACTIVE' },
  deviceLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  expiredDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('EnrollmentPin', enrollmentPinSchema);
