const { admin } = require('../config/firebase');
const os = require('os');
const { success } = require('../utils/response');

exports.getStatus = (req, res) => {
  return success(res, {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: os.loadavg(),
    database: admin.apps.length > 0 ? 'connected' : 'disconnected',
    provider: 'firebase'
  });
};

exports.getVersion = (req, res) => {
  return success(res, { version: '1.0.0', build: '2024.1' });
};

exports.getSystemInfo = (req, res) => {
  return success(res, {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMem: os.totalmem(),
    freeMem: os.freemem()
  });
};
