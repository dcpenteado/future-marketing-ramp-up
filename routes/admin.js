"use strict";
const express = require("express");
const config = require("../config");
const DBController = require("../database/dbController");
const log = require("../core/logger");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../auth");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const utils = require("../core/utils");
const bcrypt = require("bcryptjs");


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
  } catch (err) { }
});

router.post("/upload-profile-picture", auth, upload.single("image"), async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user?._id) return res.send({ error: true, message: "É necessário estar logado para mudar a imagem de perfil." });

    if (req.file && req.file.buffer) {
      const original = await sharp(req.file.buffer).resize(800).jpeg({ mozjpeg: true }).toBuffer();
      const image_id = uuidv4();

      const upload = await utils.uploadToS3(original, 'profile_pictures', `${image_id}.jpg`, 'image/jpeg');

      if (!upload) return res.send({ error: true, message: "Não foi possível fazer o upload. Por favor, tente novamente." });
      const image_url = `${config.s3_endpoint}profile_pictures/${image_id}.jpg`;

      let user = await DBController.getUserById(req_user._id);
      user.profile_picture = image_url;
      await DBController.updateUser(user);

      return res.send({ error: false, message: image_url });
    } else {
      return res.status(400).send({ error: true, message: "Imagem não reconhecida." });
    }
  } catch (err) {
    return res.status(400).send({ error: true, message: err.message });
  }
});


router.post("/change-user-password", auth, async (req, res) => {
  try {
    const req_user = req.req_user;

    const { old_password, password } = req.body;

    if (!old_password || !password) return res.status(200).send({ error: true, message: "Senha necessária!" });

    const resp = await DBController.authUser(req_user.email, old_password);

    if (resp.error && resp.type === "password_error") {
      return res.status(200).send({ error: true, message: "Senha antiga incorreta. Tente novamente." });
    } else {
      if (resp.user) {
        let user = resp.user;
        user.password = await bcrypt.hash(password, 10);
        const new_user = await DBController.updateUser(user);
        return res.send({ error: false, message: new_user });
      } else {
        return res.status(200).send({ error: true, message: "Erro ao alterar a senha. Verifique os dados e tente novamente." });
      }
    }
  } catch (err) {
    return res.status(400).send({ error: true, message: err.message });
  }
});

router.post("/update-user", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user?._id) return res.send({ error: true, message: "É necessário estar logado." });

    let { user } = req.body;

    if (!user || !user._id) return res.send({ error: true, message: "É necessário enviar dados do usuário." });

    if (!req_user.admin && req_user._id != user._id) return res.send({ error: true, message: "Permissões insuficientes." });

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const resp = await DBController.updateUser(user);
    return res.send({ error: false, message: resp });

  } catch (err) {
    return res.status(400).send({ error: true, message: err.message });
  }
});

router.post("/get-forms", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    const resp = await DBController.getForms();
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-form-by-id", auth, async (req, res) => {
  try {
    const { form_id } = req.body;

    if (!form_id) return res.send({ error: true, message: "form_id requerido." });

    const resp = await DBController.getFormById(form_id)
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/create-or-update-form", auth, async (req, res) => {
  try {
    //CHECK PERMISSION
    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    let { object } = req.body;

    if (!object || !object.name) return res.send({ error: true, message: "O nome do formulário é um campo obrigatório." });

    const resp = await DBController.createOrUpdateForm(object);
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

module.exports = function () {
  return router;
};
