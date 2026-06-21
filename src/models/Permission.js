const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'manage_users'
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
