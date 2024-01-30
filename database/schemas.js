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

mongoose.model("users", UserSchema);