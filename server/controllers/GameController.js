const chalk = require("chalk");

class GameController {
  /**
   * מקבל שחקן שמצטרף למשחק דרך מערכת הטלפון
   * POST /game/join
   * body: { ApiExtension (gameId), ApiPhone }
   */
  joinGame({ req, res }) {
    try {
      const { ApiExtension, ApiPhone } = req.body;

      if (!ApiExtension || !ApiPhone) {
        return res.status(400).json({ error: "Missing ApiExtension or ApiPhone" });
      }

      const io = req.app.get("io");
      const gameId = String(ApiExtension);

      console.log(chalk.green(`[JOIN] phone=${ApiPhone} → room=${gameId}`));

      // שידור לכל המאזינים בחדר הספציפי
      io.to(gameId).emit("player/joined", { phone: ApiPhone, gameId });

      return res.json({ ok: true });
    } catch (e) {
      console.error(chalk.red("[joinGame error]"), e);
      return res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * מקבל הצבעה ומעביר אותה לחדר המתאים
   * POST /game/voting
   * body: { ApiExtension (gameId), ApiPhone, vote, ApiTime, playerName }
   */
  voting({ req, res }) {
    try {
      const { ApiExtension, ApiPhone, vote, ApiTime, playerName } = req.body;

      if (!ApiExtension || !vote) {
        return res.status(400).json({ error: "Missing ApiExtension or vote" });
      }

      const io = req.app.get("io");
      const gameId = String(ApiExtension);

      console.log(chalk.cyan(`[VOTE] phone=${ApiPhone} vote=${vote} → room=${gameId}`));

      // שידור רק לחדר הספציפי - מערכת המשחק מאזינה לחדר שלה
      io.to(gameId).emit("voting", {
        phone: ApiPhone,
        vote,
        time: ApiTime,
        playerName,
        gameId,
      });

      return res.json({ ok: true });
    } catch (e) {
      console.error(chalk.red("[voting error]"), e);
      return res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = GameController;
