"use strict";
const jwt = require("jsonwebtoken");
const config = require("./config");
const DBController = require("./database/dbController");

const auth = async (req, res, next) => {
  const token_header = req.headers.auth;
  if (!token_header) return res.status(401).send({ error: true, message: "Token não enviado!", logoff: true });

  jwt.verify(token_header, config.jwt_secret_code, async (err, decoded) => {
    if (err) return res.status(401).send({ error: true, message: "Token inválido!", logoff: true });
    const user = await DBController.getUserById(decoded.user._id);
    if (!user || user.filed) return res.status(401).send({ error: true, message: "Usuário não encontrado!", logoff: true });

    req.req_user = user;
    return next();
  });
};

module.exports = {
  auth,
};
