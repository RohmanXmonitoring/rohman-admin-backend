const AuditLog = require('../models/AuditLog');
const { success, error } = require('../utils/response');

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'fullName username email')
      .sort({ createdAt: -1 })
      .limit(100);
    return success(res, logs);
  } catch (err) {
    return error(res, err.message);
  }
};
