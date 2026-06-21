const License = require('../models/License');
const { success, error } = require('../utils/response');
const { redisClient } = require('../config/redis');

exports.getLicenses = async (req, res) => {
  try {
    const licenses = await License.find().populate('userId').sort({ createdAt: -1 });
    return success(res, licenses);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createLicense = async (req, res) => {
  try {
    const { userId, type, expiryDate } = req.body;
    const license = await License.create({
      userId,
      type,
      expiryDate: new Date(expiryDate),
      status: 'ACTIVE'
    });

    if (redisClient.isOpen) await redisClient.del('dashboard_stats');

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'CREATE', licenseId: license.id });
    }

    return success(res, license, 'License created successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateLicense = async (req, res) => {
  try {
    if (req.body.expiryDate) req.body.expiryDate = new Date(req.body.expiryDate);

    const license = await License.findByIdAndUpdate(req.params.id, req.body);
    if (!license) return error(res, 'License not found', 404);

    if (redisClient.isOpen) await redisClient.del('dashboard_stats');

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'UPDATE', licenseId: license.id });
    }

    return success(res, license, 'License updated successfully');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteLicense = async (req, res) => {
  try {
    const license = await License.findByIdAndDelete(req.params.id);
    if (!license) return error(res, 'License not found', 404);

    if (redisClient.isOpen) await redisClient.del('dashboard_stats');

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'DELETE', licenseId: req.params.id });
    }

    return success(res, null, 'License deleted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
