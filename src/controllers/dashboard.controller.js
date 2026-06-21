const { User, Device, License, EnrollmentPin } = require('../models');
const { success, error } = require('../utils/response');

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDevices,
      onlineDevices,
      activeLicenses,
      expiredLicenses,
      activePins
    ] = await Promise.all([
      User.countDocuments(),
      Device.countDocuments(),
      Device.countDocuments({ status: 'ONLINE' }),
      License.countDocuments({ status: 'ACTIVE' }),
      License.countDocuments({ status: 'EXPIRED' }),
      EnrollmentPin.countDocuments({ status: 'ACTIVE' })
    ]);

    return success(res, {
      totalUsers: totalUsers.toString(),
      totalDevices: totalDevices.toString(),
      onlineDevices: onlineDevices.toString(),
      offlineDevices: (totalDevices - onlineDevices).toString(),
      activeLicenses: activeLicenses.toString(),
      expiredLicenses: expiredLicenses.toString(),
      activePins: activePins.toString()
    });
  } catch (err) {
    return error(res, err.message);
  }
};
