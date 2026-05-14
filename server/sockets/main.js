const socket = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const room = require("./roomSocket");
const game = require("./gameSocket");
// const app = require("../server");

const Main = (server, app) => {
  try {
    const io = socket(server, {
      allowEIO3: true,
      cors: {
        origin: [
          "http://localhost:3068",
          "https://admin.socket.io",
          "http://localhost:3000",
          "http://localhost:5502",
          "http://127.0.0.1:5500/",
          "http://127.0.0.1:5500/",
          "http://127.0.0.1:5501/",
          "http://127.0.0.1:5502/",
          "http://127.0.0.1:5503/",
          "http://127.0.0.1:5504/",
          "http://127.0.0.1:5505/",
          "http://127.0.0.1:5506/",
          "http://127.0.0.1:5507/",
          "https://closeapp.co.il/racheli/gameRemotes/index.html",
          "https://closeapp.co.il",
          "https://clicker.co.il",
          "https://messiah.clicker.co.il",
          "https://game.clicker.co.il",
          "*",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    // connecting to socket.io admin dashboard
    instrument(io, {
      auth: false,
    });

    io.on("connection", async (socket) => {
      try {
        console.log("connection");

        room(socket, io);
        game(socket, io);

        socket.use(async ([event, ...args], next) => {
          let user = socket.data.user;
          if (!user) {
            user = socket.data.user = {};
            user.socketId = socket.id;
            user.phone = args[0].phone;
            user.room = args[0].gameId;
            // console.log("user",user);
          }
          //takes the event family from event name
          //for example event "user/test" - the event family will be user
          // if (!socket.data.user) return next(new Error("unauthorized"));
          // const eventFamily = event.split("/")[0];
          next();
        });
        //TODO: add socket groups here like the event example
        // EventSockets(socket, io);

        socket.on("disconnect", async () => {
          console.log("disconnect");
          socket.disconnect();
        });
        socket.on("disconnecting", () => {
          console.log(socket.rooms); // the Set contains at least the socket ID
        });
        socket.on("error", (err) => {
          console.log("err", err);
          if (err && err.message === "unauthorized") {
            socket.disconnect();
          }
        });
        app.set("socket", socket);
        app.set("io", io);
      } catch (e) {
        socket.disconnect();
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = Main;
