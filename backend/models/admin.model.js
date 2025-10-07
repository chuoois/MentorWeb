// models/admin.model.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  phone: String,
  password_hash: String,

  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
