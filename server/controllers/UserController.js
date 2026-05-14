const Controller = require("./Controller");

class UserController extends Controller {
  /**
   * controller for User
   * @param {String} name the name of the model
   * @param {Mongoose.model} model Mongoose.model the controller model
   */
  constructor(name, model) {
    const modifableValues = ["name", "role", "phone"];
    super(name, model, modifableValues);
  }
}

module.exports = UserController;
