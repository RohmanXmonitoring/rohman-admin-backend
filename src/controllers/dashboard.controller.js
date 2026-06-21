const { User, Device, License, EnrollmentPin } = require('../models');
const { success, error } = require('../utils/response');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

exports.getStats = async (req, res) => {
  try {
    const cacheKey = 'dashboard_stats';

    // Try to get from Redis cache
    if (redisClient.isOpen) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        logger.info('Serving dashboard stats from cache');
        return success(res, JSON.parse(cachedData));
      }
    }

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

    const stats = {
      totalUsers: totalUsers.toString(),
      activeDevices: totalDevices.toString(), // Renamed to match Android App DashboardStats
      onlineDevices: onlineDevices.toString(),
      offlineDevices: (totalDevices - onlineDevices).toString(),
      activeLicenses: activeLicenses.toString(),
      expiredLicenses: expiredLicenses.toString(),
      activePins: activePins.toString()
    };

    // Save to Redis cache for 5 minutes
    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(stats));
    }

    return success(res, stats);
  } catch (err) {
    return error(res, err.message);
  }
};
