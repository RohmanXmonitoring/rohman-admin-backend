const EnrollmentPin = require('../models/EnrollmentPin');
const crypto = require('crypto');
const { success, error } = require('../utils/response');
const { redisClient } = require('../config/redis');

exports.getPins = async (req, res) => {
  try {
    const pins = await EnrollmentPin.find().sort({ createdAt: -1 });
    return success(res, pins);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.generatePin = async (req, res) => {
  try {
    const { deviceLimit, expiryDays } = req.body;
    const pinCode = crypto.randomInt(100000, 999999).toString();

    const pin = await EnrollmentPin.create({
      pinCode,
      deviceLimit: deviceLimit || 1,
      expiredDate: new Date(Date.now() + (expiryDays || 7) * 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    });

    if (redisClient.isOpen) await redisClient.del('dashboard_stats');

    if (global.io) {
      global.io.to('admin_room').emit('pin_updated', { action: 'CREATE', pinId: pin.id });
    }

    return success(res, pin, 'PIN generated successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deletePin = async (req, res) => {
  try {
    const pin = await EnrollmentPin.findByIdAndDelete(req.params.id);
    if (!pin) return error(res, 'PIN not found', 404);

    if (redisClient.isOpen) await redisClient.del('dashboard_stats');

    if (global.io) {
      global.io.to('admin_room').emit('pin_updated', { action: 'DELETE', pinId: req.params.id });
    }

    return success(res, null, 'PIN deleted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
