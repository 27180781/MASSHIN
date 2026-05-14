const router = require("express").Router();
const UserController = require("../controllers/UserController");
const auth = require("../middleware/auth");
const User = require("../models/UserModel");

const createRoutes = () => {
	const c = new UserController("user", User);
	//Basic Crud routes
	router.get("/", auth(1), c.index());
	router.get("/:id", auth(0), c.show());
	router.post("/", auth(0), c.store());
	router.put("/:id", auth(0), c.update());
	router.delete("/:id", auth(0), c.destroy());
	return router;
};

module.exports = createRoutes;
