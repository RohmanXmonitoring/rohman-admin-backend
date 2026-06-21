const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  target: { type: String, enum: ['ALL', 'USER', 'ROLE'], default: 'ALL' },
  targetId: String, // userId or role name
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
