const User = require('./User');
const Device = require('./Device');
const License = require('./License');
const EnrollmentPin = require('./EnrollmentPin');
const AuditLog = require('./AuditLog');
const Permission = require('./Permission');
const Session = require('./Session');

// User indexes
User.schema.index({ username: 1 });
User.schema.index({ email: 1 });

// Device indexes
Device.schema.index({ deviceId: 1 });
Device.schema.index({ status: 1 });

// License indexes
License.schema.index({ userId: 1 });
License.schema.index({ status: 1 });

// AuditLog indexes
AuditLog.schema.index({ createdAt: -1 });
AuditLog.schema.index({ userId: 1 });

// Session indexes
Session.schema.index({ userId: 1 });
Session.schema.index({ refreshToken: 1 });

module.exports = {
  User,
  Device,
  License,
  EnrollmentPin,
  AuditLog,
  Permission,
  Session
};
