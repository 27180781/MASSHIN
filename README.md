# Mashiash

# Controller

- All controllers inherit from the Controller Class
- Controllers inherit basic general CRUD controllers

#### To implement this inheritance the Controller instance should be initialized with

- name - String
- model - Mongoose model
- modifableValues - Array String of the model values that should be modified on update controller

## Controller example

```js
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
```

# Router

To create router for model, you need to add the model name into server>routes>routeList.json file

## Router example

```js
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
```
