const router = require("express").Router();
const GameController = require("../controllers/GameController");

const createRoutes = () => {
  const c = new GameController("game");
  router.post("/start", (req, res) => c.joinGame({ req, res }));
  router.post("/voting", (req, res) => c.voting({ req, res }));
  return router;
};

module.exports = createRoutes;
