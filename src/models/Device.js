const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true, trim: true },
  deviceId: { type: String, unique: true, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  androidVersion: String,
  battery: { type: Number, min: 0, max: 100 },
  storage: String,
  ram: String,
  networkStatus: String,
  lastOnline: { type: Date, default: Date.now },
  status: { type: String, enum: ['ONLINE', 'OFFLINE', 'LOST_MODE'], default: 'OFFLINE' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
