const ErrorService = require("../services/ErrorService");
const chalk = require("chalk");

class GameController {
  async joinGame({ req, res }) {
    console.log(chalk.bgGreen("joinGame"));
    try {
      // ApiExtension = gameId
      const { ApiExtension, ApiDID, ApiPhone } = req.body;

      console.log("joinGame", ApiPhone);

      const socket = req.app.get("socket");
      const io = req.app.get("io");

      socket.join(+ApiExtension);
      io.to(+ApiExtension).emit("join/room", { phone: ApiPhone });
      return res.send("OK");
    } catch (e) {
      console.log(e);
      return ErrorService.createError(
        `Game Controller | joinGame`,
        ErrorService.errors.generalError,
        res
      );
    }
  }
  async voting({ req, res }) {
    console.log(chalk.bgGreen("voting"));
    const io = req.app.get("io");
    try {
      // ApiExtension = gameId
      const {
        ApiExtension,
        ApiDID,
        vote,
        ApiPhone,
        gameId,
        ApiTime,
        playerName,
      } = req.body;

      if (!gameId) {
        io.to(+ApiExtension).emit("join/room", ApiPhone);
        return res.send("OK");
      } else {
        io.to(+gameId).emit("voting", {
          vote,
          phone: ApiPhone,
          time: ApiTime,
          playerName: playerName,
        });
        return res.send("OK");
      }
    } catch (e) {
      console.log(e);
      return ErrorService.createError(
        `Game Controller | voting`,
        ErrorService.errors.generalError,
        res
      );
    }
  }
}

module.exports = GameController;
