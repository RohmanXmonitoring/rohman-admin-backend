const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { admin } = require('./config/firebase');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Global io for use in controllers
global.io = io;

// Socket.IO Logic
require('./sockets')(io);

// Background Jobs
require('./jobs/license.job');

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, '0.0.0.0', async () => {
  logger.info(`Server running on port ${PORT}`);

  // Connect to Redis
  await connectRedis();

  if (admin.apps.length > 0) {
    logger.info('Backend is using Firebase Services');
  } else {
    logger.error('Firebase not initialized! Check environment variables.');
  }
});
