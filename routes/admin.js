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

    const { user } = req.body;
    if (!user.email || !user.password || !user.name) return res.send({ error: true, message: "Campos obrigatórios: email, senha, nome" });

    const existing_user = await DBController.getUserByEmail(user.email);
    if (existing_user) return res.send({ error: true, message: "Esse usuário já está cadastrado. Se tiver dificuldades para lembrar a senha, tente recuperá-la." });

    const recovery_token = uuidv4();

    let new_user = await DBController.createUser(user.email.toLowerCase(), user.password, user.name, user.admin, recovery_token);
    if (new_user.error === true) return res.status(403).send({ error: true, message: "Erro ao criar novo usuário." });
    let token = createUserToken(new_user, false);
    if (token.error === true) return res.status(400).send({ error: true, message: "Erro na geração do token" });

    return res.send({ new_user, token });
  } catch (err) {
    return res.status(400).send({ error: true, message: err.message });
  }
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

router.post("/upload-image", auth, upload.single("image"), async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user?._id) return res.send({ error: true, message: "É necessário estar logado para enviar uma imagem." });

    if (req.file && req.file.buffer) {
      const original = await sharp(req.file.buffer).resize(1200).jpeg({ mozjpeg: true }).toBuffer();
      const image_id = uuidv4();

      const upload = await utils.uploadToS3(original, 'images', `${image_id}.jpg`, 'image/jpeg');

      if (!upload) return res.send({ error: true, message: "Não foi possível fazer o upload. Por favor, tente novamente." });
      const image_url = `${config.s3_endpoint}images/${image_id}.jpg`;

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

    const existing_user = await DBController.getUserById(user._id);
    if (!existing_user.filed && user.filed) {
      //ESTÁ APAGANDO UM USUÁRIO
      user.email = `${uuidv4()}_${user.email}`;
    }

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
    const { id } = req.body;

    if (!id) return res.send({ error: true, message: "ID do formulário é um campo requerido." });

    const resp = await DBController.getFormById(id)
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

    if (!object || !object.name) return res.send({ error: true, message: "O nome do formulário é um campo requerido." });

    const resp = await DBController.createOrUpdateForm(object);
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});


router.post("/get-form-responses", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    const resp = await DBController.getFormResponses();
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-form-response-by-id", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    const { id } = req.body;

    if (!id) return res.send({ error: true, message: "ID do formulário de respostas é um campo requerido." });

    const resp = await DBController.getFormResponseById(id);
    if (!resp) return res.send({ error: true, message: "Formulário de respostas não encontrado." });

    if (!req_user.admin && resp.user._id.toString() != req_user._id.toString()) return res.send({ error: true, message: "Permissões insuficientes." });

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-form-response-by-user-id", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    const { user_id } = req.body;

    if (!user_id) return res.send({ error: true, message: "ID do usuário é um campo requerido." });

    const resp = await DBController.getFormResponseByUserId(user_id);
    if (!resp) return res.send({ error: true, message: "Formulário de respostas não encontrado." });

    if (!req_user.admin && resp.user._id.toString() != req_user._id.toString()) return res.send({ error: true, message: "Permissões insuficientes." });

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

//USADO PARA ASSOCIAR FORMULÁRIOS COM USUÁRIOS, PARA APAGAR (FILED = TRUE) OU PARA ALTERAR ALGO DIFERENTE DAS RESPOSTAS
router.post("/create-or-update-form-response", auth, async (req, res) => {
  try {
    //CHECK PERMISSION
    const req_user = req.req_user;

    if (!req_user.admin) {
      return res.send({ error: true, message: "Permissões insuficientes." });
    }

    let { object } = req.body;

    if (!object) return res.send({ error: true, message: "Campos insuficientes." });

    if (!object.user || !object.form) {
      return res.send({ error: true, message: "Usuário e formulário são campos requeridos." });
    }

    delete object.answers;
    const resp = await DBController.createOrUpdateFormResponse(object, req_user._id);

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/set-form-response-status", auth, async (req, res) => {
  try {
    //CHECK PERMISSION
    const req_user = req.req_user;

    const { form_response_id, status } = req.body;

    if (!form_response_id) return res.send({ error: true, message: "Campos insuficientes." });

    let form_response = await DBController.getFormResponseById(form_response_id);
    form_response.status = status;
    await DBController.createOrUpdateFormResponse(form_response, req_user._id);

    return res.send({ error: false, message: 'ok' });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});


//USADO PARA INSERIR NOVAS RESPOSTAS
router.post("/create-form-response-answers", auth, async (req, res) => {
  try {
    //CHECK PERMISSION
    const req_user = req.req_user;

    let { object } = req.body;

    if (!object) return res.send({ error: true, message: "Campos insuficientes." });

    if (!object._id) {
      return res.send({ error: true, message: "ID do formulário requerido." });
    }

    if (!object.answers) {
      return res.send({ error: true, message: "É necessário enviar pelo menos uma resposta." });
    }

    let existing_form = await DBController.getFormResponseById(object._id);

    if (!existing_form) {
      return res.send({ error: true, message: "Formulário de respostas não encontrado." });
    }

    // only update if user is the same or if admin
    if (!req_user.admin && existing_form.user._id.toString() != req_user._id.toString()) {
      return res.send({ error: true, message: "Permissões insuficientes." });
    }


    if (!existing_form.answers) existing_form.answers = [];

    object.answers.forEach(a => {
      if (a.category_id && a.question_id) {
        let answer_index = existing_form.answers.findIndex(i => i.question_id == a.question_id);
        if (answer_index == -1) {
          existing_form.answers.push({
            category_id: a.category_id,
            question_id: a.question_id,
            versions: [
              {
                value: a.markedAsEmpty ? "" : (a.value || ""),
                origin: req_user.admin ? 'editor' : 'user',
                markedAsEmpty: a.markedAsEmpty,
                createdBy: req_user._id,
                createdAt: new Date()
              }
            ]
          })
        }
        else {
          const last_value = existing_form.answers[answer_index].versions[existing_form.answers[answer_index].versions.length - 1].value;
          const isEmpty = existing_form.answers[answer_index].versions[existing_form.answers[answer_index].versions.length - 1].markedAsEmpty;

          //SÓ INCLUI SE EXISTIR DIFERENÇA DO VALUE
          if (last_value != a.value || isEmpty != a.markedAsEmpty) {
            existing_form.answers[answer_index].versions.push({
              value: a.markedAsEmpty ? "" : (a.value || ""),
              origin: req_user.admin ? 'editor' : 'user',
              markedAsEmpty: a.markedAsEmpty,
              createdBy: req_user._id,
              createdAt: new Date()
            })
          }
        }
      }
    });

    const resp = await DBController.createOrUpdateFormResponse(existing_form, req_user._id);

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-customers", auth, async (req, res) => {
  try {
    const req_user = req.req_user;

    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });
    const resp = await DBController.getUsers({ admin: false });

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-administrators", auth, async (req, res) => {
  try {
    const req_user = req.req_user;

    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });
    const resp = await DBController.getUsers({ admin: true });

    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-ramp-up-elements-by-form-id", auth, async (req, res) => {
  try {
    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    const { form_id } = req.body;

    if (!form_id) return res.send({ error: true, message: "ID do formulário é um campo requerido." });

    const resp = await DBController.getRampUpElementsByFormId(form_id);
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/get-ramp-up-element-by-id", auth, async (req, res) => {
  try {

    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    const { id } = req.body;
    if (!id) return res.send({ error: true, message: "ID do elemento Ramp-Up é um campo requerido." });

    const resp = await DBController.getRampUpElementById(id)
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/create-or-update-ramp-up-element", auth, async (req, res) => {
  try {
    //CHECK PERMISSION
    const req_user = req.req_user;
    if (!req_user.admin) return res.send({ error: true, message: "Permissões insuficientes." });

    let { object } = req.body;

    if (!object || !object.form || !object.content || !object.type || !object.id || !object.description) return res.send({ error: true, message: "Formulário, conteúdo, tipo, id e descrição são campos obrigatórios." });

    const resp = await DBController.createOrUpdateRampUpElement(object);
    return res.send({ error: false, message: resp });
  } catch (err) {
    return res.send({ error: true, message: err.message });
  }
});

router.post("/teste", async (req, res) => {
  try {
    let texts = [];

    const { form_response_id } = req.body;

    if (!form_response_id) return res.send({ error: true, message: "Faltam itens." });

    const form_response = await DBController.getFormResponseById(form_response_id);
    const ramp_up_elements = await DBController.getRampUpElementsByFormId(form_response.form);

    for (let i in ramp_up_elements) {
      const element = ramp_up_elements[i];

      let renderedText = utils.rampUpElementToText(element.content.content, form_response.answers);

      if (renderedText && element.type == 'prompt') {
        renderedText = await utils.processTextWithChatGPT(renderedText, element.temperature || 0.5, element.max_tokens || 1000);
      }

      texts.push({ id: element.id, text: renderedText });
    }

    return res.send({ error: false, message: texts })
  } catch (err) {
    console.log(err.message)
    return res.send({ error: true, message: err.message });
  }
});



module.exports = function () {
  return router;
};
