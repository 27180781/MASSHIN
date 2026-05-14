const Events = (socket, io) => {
  socket.on("game/voting", async ({ phone, gameId, vote }) => {
    // console.log("voting", { phone, gameId, vote });
    io.to(+gameId).emit("game/voting", { phone, vote });
  });
};

module.exports = Events;
