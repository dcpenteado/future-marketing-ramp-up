"use strict";
const config = require("./config");
const mongoose = require("mongoose");
const log = require("./core/logger");
const express = require("express");
const fs = require("fs");
const cors = require("cors");

//BANCO DE DADOS
if (config.connection_string) {
  const options = { maxPoolSize: 10, useNewUrlParser: true };

  mongoose.set('strictQuery', false);
  mongoose.connect(config.connection_string, options);

  mongoose.connection.on("error", function (err) {
    log.emit("error", "Erro na conexão com banco de dados: " + err);
  });

  mongoose.connection.on("disconnected", function () {
    log.emit("warning", "Aplicação desconectada do banco de dados: " + mongoose.connection.readyState);
  });

  mongoose.connection.on("connected", function () {
    log.emit("info", "Aplicação conectada ao banco de dados: " + mongoose.connection.readyState);
  });

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      log.emit("warning", "Banco de dados terminou a conexão com esta aplicação");
      process.exit(0);
    });
  });
}

//EXPRESS
let app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));

if (config.static_folder) {
  if (!fs.existsSync(`./${config.static_folder}`)) fs.mkdirSync(`./${config.static_folder}`);
  app.use("/static/", express.static(`./${config.static_folder}`));
}

if (!config.headless_cms_mode) {
  app.use("/css", express.static(__dirname + "/public/admin_frontend/dist/css"));
  app.use("/js", express.static(__dirname + "/public/admin_frontend/dist/js"));
  app.use("/img", express.static(__dirname + "/public/admin_frontend/dist/img"));
  app.use("/*", express.static(__dirname + "/public/admin_frontend/dist"));
}

const admin = require("./routes/admin")();
app.use("/admin", admin);

app.listen(config.port, () => {
  log.emit("info", `Backend online na porta ${config.port}`);
});
