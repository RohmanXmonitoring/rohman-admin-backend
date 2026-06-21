const AuditLog = require('../models/AuditLog');

module.exports = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
      res.json = originalJson;

      // Log after response is sent if successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        AuditLog.create({
          userId: req.user ? req.user.userId : null,
          action: action,
          details: {
            method: req.method,
            path: req.originalUrl,
            params: req.params,
            body: req.body, // Be careful with sensitive data in production
            response: data
          },
          ipAddress: req.ip,
          status: 'SUCCESS'
        }).catch(err => console.error('Audit Log Error:', err));
      }

      return res.json(data);
    };
    next();
  };
};
