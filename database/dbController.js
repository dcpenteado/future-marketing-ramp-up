require("./schemas");

const mongoose = require("mongoose");
const Users = mongoose.model("users");
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
const getUsers = async () => {
  try {
    if (mongoose.connection.readyState != 1) await connectDatabase();

    const resp = await Users.find();
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

module.exports = {
  init,

  authUser,
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  updateUser,
};
