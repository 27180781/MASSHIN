const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
class AuthServices {
	static emailValidation(email) {
		try {
			let regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
			return regEx.test(email);
		} catch (e) {
			throw e;
		}
	}
	/**
	 * prepare user for client
	 * @param {Object} user Mongoose object - user
	 * @returns user for client
	 */
	static getUser(user) {
		try {
			const { name, email, role, _id, address, phone } = user;
			//TODO: change here to wanted fields;
			return {
				address,
				phone,
				name,
				email,
				role,
				_id,
			};
		} catch (e) {
			throw 500;
		}
	}
	static async getUserFromCookie(cookie) {
		try {
			let user;
			//if user is from google
			if (cookie && cookie._id) {
				console.log("User from google");
				user = await User.findOne({ _id: cookie._id });
			}
			//if user signed from email and phone
			else if (cookie) {
				console.log("regular user (not from google)");
				const decoded = jwt.verify(cookie, process.env.COOKIES_AUTH);
				user = await User.findOne({ _id: decoded.user });
			}
			if (!user) throw 401;
			return user;
		} catch (e) {
			throw 401;
		}
	}
	/**
	 * Find authenticated user by its cookie and adds user to request object
	 * @param {*} req the http request object
	 */
	static async getUserFromReq(req) {
		try {
			const cookie = req.user ? req.user : req.cookies.user;
			const user = await AuthServices.getUserFromCookie(cookie);
			if (user.role < 4) user["isAdmin"] = true;
			req.user = user;
		} catch (e) {
			throw 401;
		}
	}
}

module.exports = AuthServices;
