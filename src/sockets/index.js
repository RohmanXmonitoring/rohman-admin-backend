module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_admin_room', () => {
      socket.join('admin_room');
      console.log(`Socket ${socket.id} joined admin_room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Global emitter helper
  global.io = io;
};
