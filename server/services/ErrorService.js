const chalk = require("chalk");
class Services {
  //This is the errors object, using the createError method
  static errors = {
    generalError: {
      err: "Something went wrong",
      he: "משהו השתבש",
      status: 500,
    },
    notFound: {
      err: "Not found",
      he: "לא נמצא",
      status: 404,
    },
    missingDetails: {
      err: "Some details are missing",
      he: "פרטים חסרים",
      status: 400,
    },
    auth: {
      emailExists: { err: "Email is taken", he: "אימייל בשימוש", status: 401 },
      badCreds: { err: "Bad details", he: "פרטים שגויים", status: 401 },
    },
  };

  static logError(routeName, msg) {
    let errorFrom = `ERROR from ${routeName}: `;
    console.log(chalk.red(errorFrom, msg));
    return msg;
  }

  static logSuccess(routeName, msg) {
    let successFrom = `SUCCESS from: ${routeName}`;
    console.log(chalk.green(successFrom, msg));
    return msg;
  }

  /**
   * Create Error - print to the console and create error object to send to the client
   * @param {*} where - the name of the function in server that the error occured
   * @param {*} errMsg - services.erros object, that contains the error in hebrew / english
   * @param {*} res - express response object
   */
  static createError(where, errMsg, res) {
    errMsg["clapErr"] = true;
    this.logError(where, errMsg.err);
    return res.status(errMsg.status).send(errMsg);
  }
}

module.exports = Services;
