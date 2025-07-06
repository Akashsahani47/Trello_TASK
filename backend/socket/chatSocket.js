export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected");

    // Join room for private messaging
    socket.on("joinRoom", ({ userId, otherUserId }) => {
      const room = [userId, otherUserId].sort().join("-");
      socket.join(room);
      console.log(`👤 User ${userId} joined room ${room}`);
    });

    // Handle private messages
    socket.on("privateMessage", ({ sender, receiver, content }) => {
      const room = [sender, receiver].sort().join("-");
      io.to(room).emit("privateMessage", {
        sender,
        receiver,
        content,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });
};
