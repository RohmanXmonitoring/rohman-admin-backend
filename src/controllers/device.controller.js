const Device = require('../models/Device');
const { success, error } = require('../utils/response');
const { redisClient } = require('../config/redis');

exports.getDevices = async (req, res) => {
  try {
    const cacheKey = 'devices_list';
    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return success(res, JSON.parse(cached));
    }

    const devices = await Device.find().populate('userId').sort({ lastOnline: -1 });

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 30, JSON.stringify(devices)); // Cache for 30 seconds
    }

    return success(res, devices);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id).populate('userId');
    if (!device) return error(res, 'Device not found', 404);
    return success(res, device);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body);
    if (!device) return error(res, 'Device not found', 404);

    if (redisClient.isOpen) {
      await redisClient.del('devices_list');
      await redisClient.del('dashboard_stats');
    }

    if (global.io) {
      global.io.to('admin_room').emit('device_updated', device);
    }

    return success(res, device, 'Device updated successfully');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return error(res, 'Device not found', 404);

    if (redisClient.isOpen) {
      await redisClient.del('devices_list');
      await redisClient.del('dashboard_stats');
    }

    if (global.io) {
      global.io.to('admin_room').emit('device_updated', { action: 'DELETE', id: req.params.id });
    }

    return success(res, null, 'Device removed successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
