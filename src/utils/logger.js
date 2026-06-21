const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const transportError = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

const transportCombined = new winston.transports.DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] ${level}: ${stack || message}`;
        })
      )
    })
  ]
});

// Hanya tambahkan file transport jika bukan di production/container environment yang read-only
if (process.env.NODE_ENV !== 'production') {
  logger.add(transportError);
  logger.add(transportCombined);
}

module.exports = logger;
