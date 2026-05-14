const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const AuthServices = require("../services/AuthServices");
const ErrorService = require("../services/ErrorService");

class AuthController {
  //The expire days of cookie
  static COOKIE_EXPIRE_DAYS = 7;
  static MS_DAY = 86400000;

  /**
   * Register action
   * @param req.body.email user's email
   * @param req.body.password user's password
   * @param req.body.fullname user's fullname
   * @returns 200 status if all went well
   */
  static async register(req, res) {
    try {
      let { email, password, name, phone } = req.body;
      if (!email || !password)
        return ErrorService.createError(
          "Register Controller",
          ErrorService.errors.auth.badCreds,
          res
        );
      email = email.toLowerCase();
      email = email.trim();
      if (!AuthServices.emailValidation(email))
        return ErrorService.createError(
          "Register Controller",
          ErrorService.errors.auth.badCreds,
          res
        );

      if (await User.countDocuments({ email })) {
        return ErrorService.createError(
          "Register Controller",
          ErrorService.errors.auth.emailExists,
          res
        );
      }
      await User.create({
        email,
        password,
        name,
        phone,
      });
      res.sendStatus(200);
    } catch (e) {
      return ErrorService.createError(
        "Register Controller",
        ErrorService.errors.generalError,
        res
      );
    }
  }

  /**
   * Login action
   * @param req.body.email user's email
   * @param req.body.password user's password
   * @returns 200 status if all went well
   */
  static async login(req, res) {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      email = email.trim();
      const user = await User.findOne({ email });
      if (!user)
        return ErrorService.createError(
          "Login Controller",
          ErrorService.errors.auth.badCreds,
          res
        );
      if (!(await user.checkPass(password))) {
        return ErrorService.createError(
          "Login Controller",
          ErrorService.errors.auth.badCreds,
          res
        );
      }
      let cookie = jwt.sign({ user: user._id }, process.env.COOKIES_AUTH);
      res.cookie("user", cookie, {
        maxAge: AuthController.COOKIE_EXPIRE_DAYS * AuthController.MS_DAY,
      });
      return res.send(AuthServices.getUser(user));
    } catch (e) {
      return ErrorService.createError(
        "Login Controller",
        ErrorService.errors.generalError,
        res
      );
    }
  }

  /**
   * Logs user out
   * @returns 200 status if all went well
   */
  static async logout(req, res) {
    try {
      res.clearCookie("user");
      ErrorService.logSuccess("Logout", "user has logged out");
      res.sendStatus(200);
    } catch (error) {
      return ErrorService.createError(
        "AuthController | logout",
        ErrorService.errors.generalError,
        res
      );
    }
  }

  /**
   * Checks if current user is logged in
   * @returns 200 status if all went well
   */
  static async checkLogin(req, res) {
    try {
      console.log("checkLogin found user");
      res.json(AuthServices.getUser(req.user));
    } catch (e) {
      return ErrorService.createError(
        "AuthController | login",
        ErrorService.errors.auth.notFound,
        res
      );
    }
  }
}

module.exports = AuthController;
