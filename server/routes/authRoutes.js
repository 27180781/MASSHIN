const router = require("express").Router();
const auth = require("../middleware/auth");
const AuthController = require("../controllers/AuthController");

const createRoutes = () => {
	/**
	 * Registers a user
	 */
	router.post("/register", AuthController.register);

	/**
	 * Login a user
	 */
	router.post("/login", AuthController.login);

	/**
	 * this route checks if user is logged in right now, if so it will send its details
	 */
	router.get("/checkLogin", auth(1), AuthController.checkLogin);

	/**
	 * This route logs user out
	 * There are more details of the user that can be saved here, but they are not required
	 * user have to be logged in, in order to log out
	 */
	router.post("/logout", AuthController.logout);
	return router;
};

module.exports = createRoutes;
