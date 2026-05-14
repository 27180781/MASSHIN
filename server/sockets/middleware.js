const Events = (socket, io) => {
  socket.use(async ([event, ...args], next) => {
    console.log("middleware");
    let user = socket.data.user;
    if (!user) {
      // console.log(socket.data);
      user = socket.data.user = {};
      user.socketId = socket.id;
      user.phone = args[0].phone;
      user.room = args[0].gameId;
      // console.log("user");
    }
    //takes the event family from event name
    //for example event "user/test" - the event family will be user
    // if (!socket.data.user) return next(new Error("unauthorized"));
    // const eventFamily = event.split("/")[0];
    // console.log(user);
    next();
  });
};
module.exports = Events;
