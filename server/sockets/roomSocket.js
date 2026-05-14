const Events = (socket, io) => {
  socket.on("join/room", async ({ phone, gameId }) => {
    socket.join(+gameId);
    io.to(+gameId).emit("join/room", phone);
  });
  socket.on("create-room", async ({ gameId }) => {
    console.log("create-room", gameId);
    socket.join(+gameId);
    io.to(+gameId).emit("create-room", gameId);
  });
};

module.exports = Events;
