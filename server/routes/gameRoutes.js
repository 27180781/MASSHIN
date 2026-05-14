const router = require("express").Router();
const GameController = require("../controllers/GameController");

const c = new GameController();

// מערכת הטלפון שולחת כאן הצטרפות שחקן
router.post("/join", (req, res) => c.joinGame({ req, res }));

// מערכת הטלפון שולחת כאן הצבעה
router.post("/voting", (req, res) => c.voting({ req, res }));

module.exports = router;
