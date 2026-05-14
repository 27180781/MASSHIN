const router = require("express").Router();
const GameController = require("../controllers/GameController");

const c = new GameController("game");
router.post("/game/start", (req, res) => c.joinGame({ req, res }));
router.post("/game/voting", (req, res) => c.voting({ req, res }));

module.exports = router;
