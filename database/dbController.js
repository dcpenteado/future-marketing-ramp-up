require("./schemas");

const mongoose = require("mongoose");
const Users = mongoose.model("users");
const Forms = mongoose.model("forms");
const FormResponses = mongoose.model("form_responses");
const RampUpElements = mongoose.model("ramp_up_elements");
var ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcryptjs");

let CONNECTION_STRING = "";

const init = (key) => {
  CONNECTION_STRING = key;
  return;
};

const connectDatabase = async () => {
  const options = { maxPoolSize: 10, useNewUrlParser: true };
  mongoose.connect(CONNECTION_STRING, options);
};

//AUTENTICAÇÃO DE ADMINISTRADOR
const authUser = async (email, password) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    if (!email || !password) return { error: true, type: "general_error" };

    const user = await Users.findOne({ email }).select("+password");

    if (!user) return { error: true, type: "user_not_exists" };

    const pass_ok = await bcrypt.compare(password, user.password);
    if (!pass_ok) return { error: true, type: "password_error" };

    user.password = undefined;
    return { error: false, user: user };
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

//CRIAÇÃO DE USUÁRIO PARA O ADMIN
const createUser = async (email, password, name, admin = false, recovery_token) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    if (!email || !password) return { error: true, type: "general_error" };

    let new_user = await Users.create({ email, password, name, admin, recovery_token });
    new_user.password = undefined;
    return new_user;
  } catch (err) {
    throw err;
  }
};

//BUSCA TODOS OS USUÁRIOS DO ADMIN
const getUsers = async (filter = {}) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    filter.filed = { $ne: true };

    const resp = await Users.find(filter);
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

//BUSCA UM USUÁRIO DE ADMIN
const getUserByEmail = async (email) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await Users.findOne({ email: email });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

//BUSCA UM USUÁRIO DE ADMIN
const getUserById = async (id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await Users.findOne({ _id: id });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

//ATUALIZA ADMIN
const updateUser = async (user) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();
    const resp = await Users.updateOne({ _id: user._id }, user);
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const getForms = async () => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await Forms.find({ filed: { $ne: true } });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const getFormById = async (id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await Forms.findOne({ _id: id, filed: { $ne: true } });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const createOrUpdateForm = async (object) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    let resp;

    if (object._id) {
      resp = Forms.updateOne({ _id: object._id }, object, { upsert: true, setDefaultsOnInsert: true });
    } else {
      resp = await Forms.create(object);
    }

    return resp;
  } catch (err) {
    throw err;
  }
};

const getFormResponses = async () => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await FormResponses.find({ filed: { $ne: true } }).populate('user').populate('form');
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const getFormResponseById = async (id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await FormResponses.findOne({ _id: id, filed: { $ne: true } }).populate('user').populate('form');
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const getFormResponseByUserId = async (user_id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await FormResponses.findOne({ user: user_id, filed: { $ne: true } }).populate('user').populate('form');
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const createOrUpdateFormResponse = async (object, user_id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    let resp;

    if (!object.changes) object.changes = [];
    object.changes.push({ date: new Date(), user: user_id });

    object.changed = new Date();

    if (object._id) {
      resp = FormResponses.updateOne({ _id: object._id }, object, { upsert: true, setDefaultsOnInsert: true });
    } else {
      resp = await FormResponses.create(object);
    }

    return resp;
  } catch (err) {
    throw err;
  }
};


const getRampUpElementsByFormId = async (form_id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await RampUpElements.find({ form: form_id, filed: { $ne: true } });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const getRampUpElementById = async (id) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await RampUpElements.findOne({ _id: id, filed: { $ne: true } });
    return resp;
  } catch (err) {
    return { error: true, type: "general_error" };
  }
};

const createOrUpdateRampUpElement = async (object) => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    let resp;

    if (object._id) {
      resp = RampUpElements.updateOne({ _id: object._id }, object, { upsert: true, setDefaultsOnInsert: true });
    } else {
      resp = await RampUpElements.create(object);
    }

    return resp;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  init,

  authUser,
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  updateUser,

  getForms,
  getFormById,
  createOrUpdateForm,

  getFormResponses,
  getFormResponseById,
  getFormResponseByUserId,
  createOrUpdateFormResponse,

  getRampUpElementsByFormId,
  getRampUpElementById,
  createOrUpdateRampUpElement
};
