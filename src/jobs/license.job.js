const cron = require('node-cron');
const License = require('../models/License');
const logger = require('../utils/logger');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Running Cron Job: License Expiry Check');
    const result = await License.updateMany(
      { expiryDate: { $lt: new Date() }, status: 'ACTIVE' },
      { status: 'EXPIRED' }
    );
    logger.info(`Expired licenses updated: ${result.modifiedCount}`);
  } catch (err) {
    logger.error('License Job Error: ' + err.message);
  }
});
