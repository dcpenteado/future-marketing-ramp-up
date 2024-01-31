const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  password: { type: String, required: true, select: false },
  name: { type: String },
  admin: { type: Boolean, default: false },
  customer: { type: Boolean, default: false },
  permissions: { type: Array, default: ['DEFAULT'] },
  created: { type: Date, default: Date.now },
  filed: { type: Boolean, default: false },
  profile_picture: { type: String },
  recovery_token: { type: String },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Por favor entre com um e-mail válido",
    },
    required: [true, "E-mail requerido"],
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});


const FormSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: { type: Array, default: [{ name: "Categoria inicial", description: "Descrição da categoria", questions: [] }] },
  created: { type: Date, default: Date.now },
  filed: { type: Boolean, default: false }
});

const FormResponseSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "users",
    required: true,
    index: true
  },
  form: {
    type: Schema.ObjectId,
    ref: "forms",
    required: true,
    index: true
  },
  answers: { type: Array, default: [] },
  created: { type: Date, default: Date.now },
  changed: { type: Date, default: Date.now },
  changes: { type: Array, default: [] },
  filed: { type: Boolean, default: false }
});

mongoose.model("users", UserSchema);
mongoose.model("forms", FormSchema);
mongoose.model("form_responses", FormResponseSchema);