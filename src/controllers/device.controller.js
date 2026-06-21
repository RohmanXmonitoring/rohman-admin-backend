const Device = require('../models/Device');
const { success, error } = require('../utils/response');

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('userId', 'fullName username');
    return success(res, devices);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id).populate('userId', 'fullName username');
    if (!device) return error(res, 'Device not found', 404);
    return success(res, device);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!device) return error(res, 'Device not found', 404);

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

    if (global.io) {
      global.io.to('admin_room').emit('device_updated', { action: 'DELETE', id: req.params.id });
    }

    return success(res, null, 'Device removed successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
