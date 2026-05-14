const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const gameRoutes = require("./routes/gameRoutes");
const Sockets = require("./sockets/main");

require("dotenv").config();

const app = express();

// --- Middleware ---
app.use(cors({ origin: "*", exposedHeaders: "Authorization" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static demo client ---
app.use(express.static("clientDemo"));

// --- Routes ---
app.use("/game", gameRoutes);

// --- Health check ---
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// --- Start ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(chalk.bgBlue(`\n🚀 Bridge server running on http://localhost:${chalk.bold(PORT)}\n`));
});

// --- Init Sockets ---
Sockets(server, app);
