const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const chalk = require("chalk");
const roomSocket = require("./roomSocket");
const gameSocket = require("./gameSocket");

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "https://admin.socket.io",
  "https://closeapp.co.il",
  "https://clicker.co.il",
  "https://messiah.clicker.co.il",
  "https://game.clicker.co.il",
  // הוסף כאן את הדומיין של מערכת המשחק
];

const Main = (server, app) => {
  try {
    const io = new Server(server, {
      allowEIO3: true,
      // --- ביצועים לעומס גבוה ---
      pingTimeout: 20000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6, // 1MB מקסימום להודעה
      cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // socket.io admin dashboard (רק ב-dev)
    if (process.env.NODE_ENV !== "production") {
      instrument(io, { auth: false });
    }

    // --- io זמין לכל ה-controllers דרך app ---
    // חשוב: io ולא socket - io הוא גלובלי, socket הוא per-connection
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log(chalk.gray(`[SOCKET] connected: ${socket.id}`));

      // הרשמה לחדרים (מערכת המשחק מצטרפת לחדר שלה)
      roomSocket(socket, io);

      // הצבעות דרך socket ישירות (אופציונלי)
      gameSocket(socket, io);

      socket.on("disconnect", (reason) => {
        console.log(chalk.gray(`[SOCKET] disconnected: ${socket.id} (${reason})`));
      });

      socket.on("error", (err) => {
        console.error(chalk.red(`[SOCKET ERROR] ${socket.id}`), err.message);
        socket.disconnect();
      });
    });

    // --- לוג עומס כל דקה בסביבת production ---
    if (process.env.NODE_ENV === "production") {
      setInterval(() => {
        const count = io.engine.clientsCount;
        console.log(chalk.yellow(`[STATS] connected sockets: ${count}`));
      }, 60000);
    }

    console.log(chalk.bgGreen(" Socket.IO ready "));
  } catch (e) {
    console.error(chalk.red("[Socket Init Error]"), e);
  }
};

module.exports = Main;
