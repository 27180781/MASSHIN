const Events = (socket, io) => {
  socket.on("event/dosomething", async (data) => {
    console.log(data);
    const room = socket.data.room;
    io.to(room).emit("dosomething", `You are in room ${room}`);
  });
  socket.on("event/todo", async (data) => {
    const user = socket.data.user;
    const room = socket.data.room;
    io.sockets.in(room).emit("event/todo", "You are in room");
    io.to(room).emit("event/todo", {
      ...data,
      uid: user._id,
      username: user.username,
    });
  });
};

module.exports = Events;
