const chalk = require("chalk");

/**
 * roomSocket - ניהול חדרים
 *
 * מערכת המשחק מתחברת ומצטרפת לחדר שלה לפי gameId
 * המערכת הטלפונית שולחת ל-REST API → io.to(gameId).emit(...)
 */
const roomSocket = (socket, io) => {
  /**
   * מערכת המשחק מצטרפת לחדר
   * emit: join/room { gameId }
   */
  socket.on("join/room", ({ gameId }) => {
    if (!gameId) return;
    const room = String(gameId);
    socket.join(room);
    console.log(chalk.blue(`[ROOM] socket ${socket.id} joined room ${room}`));

    // אישור הצטרפות
    socket.emit("room/joined", { gameId: room, socketId: socket.id });
  });

  /**
   * יציאה מחדר
   * emit: leave/room { gameId }
   */
  socket.on("leave/room", ({ gameId }) => {
    if (!gameId) return;
    const room = String(gameId);
    socket.leave(room);
    console.log(chalk.gray(`[ROOM] socket ${socket.id} left room ${room}`));
  });
};

module.exports = roomSocket;
