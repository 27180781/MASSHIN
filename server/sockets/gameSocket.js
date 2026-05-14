const chalk = require("chalk");

/**
 * gameSocket - הצבעות ישירות דרך socket (מסלול אופציונלי)
 * המסלול הראשי הוא POST /game/voting → io.to(gameId).emit(...)
 */
const gameSocket = (socket, io) => {
  /**
   * הצבעה ישירה דרך socket
   * emit: game/voting { phone, gameId, vote, playerName }
   */
  socket.on("game/voting", ({ phone, gameId, vote, playerName }) => {
    if (!gameId || !vote) return;

    const room = String(gameId);
    console.log(chalk.cyan(`[SOCKET VOTE] phone=${phone} vote=${vote} → room=${room}`));

    io.to(room).emit("voting", { phone, vote, playerName, gameId: room });
  });
};

module.exports = gameSocket;
