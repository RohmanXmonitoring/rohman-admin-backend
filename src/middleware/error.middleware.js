const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip} - Status: ${statusCode}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
