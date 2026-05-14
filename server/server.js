const express = require("express");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const routes = require("./routes/routes");
const Sockets = require("./sockets/main");
const app = express();
require("dotenv").config();

app.use(cookieParser());

//TODO: UnComment to use cors
var cors = require("cors");
app.use(
  cors({
    origin: "*",
    exposedHeaders: "Authorization",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for dev UnComment this row
app.use(express.static("clintDemo"));

app.use("/", routes);

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(
    chalk.bgBlue(
      `Server is listenning on port http://localhost:${chalk.bold(port)}`
    )
  );
});

Sockets(server, app);
