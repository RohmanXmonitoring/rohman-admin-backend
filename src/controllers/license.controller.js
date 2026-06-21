const License = require('../models/License');
const { success, error } = require('../utils/response');

exports.getLicenses = async (req, res) => {
  try {
    const licenses = await License.find().populate('userId', 'fullName username email').sort({ createdAt: -1 });
    return success(res, licenses);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createLicense = async (req, res) => {
  try {
    const { userId, type, expiryDate } = req.body;
    const license = new License({ userId, type, expiryDate });
    await license.save();

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'CREATE', licenseId: license._id });
    }

    return success(res, license, 'License created successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateLicense = async (req, res) => {
  try {
    const license = await License.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!license) return error(res, 'License not found', 404);

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'UPDATE', licenseId: license._id });
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

    if (global.io) {
      global.io.to('admin_room').emit('license_updated', { action: 'DELETE', licenseId: req.params.id });
    }

    return success(res, null, 'License deleted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
