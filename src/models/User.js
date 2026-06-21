const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Full name is required'], trim: true },
  username: { type: String, required: [true, 'Username is required'], unique: true, trim: true, lowercase: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, trim: true, lowercase: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'RESELLER'], default: 'RESELLER' },
  licenseType: { type: String, default: 'None' },
  licenseExpired: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  fcmToken: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
