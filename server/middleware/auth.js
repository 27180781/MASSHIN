const AuthServices = require("../services/AuthServices");
const ErrorService = require("../services/ErrorService");

//if using bearer Authorization instead of cookies.
const getBearer = req => {
	try {
		let t = req.headers.authorization;
		t = t.split(" ");
		return t[1];
	} catch (e) {
		return null;
	}
};

function auth(role = 1) {
	return async function (req, res, next) {
		try {
			console.log(`checking role ${role}`);
			await AuthServices.getUserFromReq(req);
			if (req.user.role > role) throw 401;
			next();
		} catch (e) {
			ErrorService.logError(`Auth Middleware r${role}`, "user is not verified");
			res.sendStatus(401);
		}
	};
}

module.exports = auth;
