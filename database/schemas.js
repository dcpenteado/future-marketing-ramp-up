const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  password: { type: String, required: true, select: false },
  name: { type: String },
  admin: { type: Boolean, default: false },
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
  status: { type: Number, default: 0 }, //0: novo | 1: preenchendo formulário | 2: formulário pronto | 3: processando | 4: processado pela IA | 5: revisão interna | 6: revisão do cliente | 7: revisão final | 8: aprovado para site | 9: finalizado
  answers: { type: Array, default: [] },
  ramp_up_texts: { type: Array, default: [] },
  created: { type: Date, default: Date.now },
  changed: { type: Date, default: Date.now },
  changes: { type: Array, default: [] },
  filed: { type: Boolean, default: false }
});

const RampUpElementSchema = new Schema({
  form: {
    type: Schema.ObjectId,
    ref: "forms",
    required: true
  },
  content: { type: Object, required: true },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['text', 'prompt'],
      message: "Os tipos aceitos são text ou prompt",
    },
  },
  id: { type: String, required: true },
  description: { type: String, required: true },
  max_tokens: { type: Number, default: 2000 },
  temperature: { type: Number, default: 0.5 },
  created: { type: Date, default: Date.now },
  filed: { type: Boolean, default: false }
});

RampUpElementSchema.index({ form: 1, id: 1 }, { unique: true });

mongoose.model("users", UserSchema);
mongoose.model("forms", FormSchema);
mongoose.model("form_responses", FormResponseSchema);
mongoose.model("ramp_up_elements", RampUpElementSchema);