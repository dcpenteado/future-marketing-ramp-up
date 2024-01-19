"use strict";
const express = require("express");
const config = require("../config");
const DBController = require("../database/dbController");
const log = require("../core/logger");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../auth");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

let router = express.Router();

const createUserToken = (user, remember) => {
  try {
    return jwt.sign({ user: user }, config.jwt_secret_code, { expiresIn: remember ? config.jwt_expiration_time || "30d" : "12h" });
  } catch (err) {
    console.log(err.message)
    return { error: true, message: `createUserToken error: ${err.message}` };
  }
};

router.post("/auth", async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) return res.status(400).send({ error: true, message: "E-mail e senha são campos requeridos." });

  try {
    const response = await DBController.authUser(email, password);

    if (response.error === true || !response.user) {
      return res.status(400).send({ error: true, message: "Senha não confere." });
    }

    let token = createUserToken(response.user, remember);
    if (token.error === true) return res.status(400).send({ error: true, message: "Erro na geração do token" });
    return res.send({ ...response, token });
  } catch (err) {
    return res.status(400).send({ error: true, message: `auth error: ${err.message}` });
  }
});

router.post("/get-user", auth, async (req, res) => {
  return res.send(req.req_user);
});

router.post("/create-user", auth, async (req, res) => {
  try {
    const req_user = req.req_user;

    const { email, password, name, admin } = req.body;
    if (!email || !password || !name) return res.send({ error: true, message: "Campos obrigatórios: email, senha, nome" });

    const existing_user = await DBController.getUserByEmail(email);
    if (existing_user) return res.send({ error: true, message: "Esse usuário já está cadastrado. Se tiver dificuldades para lembrar a senha, tente recuperá-la." });

    const recovery_token = uuidv4();

    let new_user = await DBController.createUser(email.toLowerCase(), password, name, admin, recovery_token);
    if (new_user.error === true) return res.status(403).send({ error: true, message: "Erro ao criar novo usuário." });
    let token = createUserToken(new_user, false);
    if (token.error === true) return res.status(400).send({ error: true, message: "Erro na geração do token" });

    return res.send({ new_user, token });
  } catch (err) {}
});

module.exports = function () {
  return router;
};
