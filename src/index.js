const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO Logic
require('./sockets')(io);

// Background Jobs
require('./jobs/license.job');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error: ' + err.message);
    process.exit(1);
  });
