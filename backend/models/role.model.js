// models/role.model.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "mentee", "mentor", "admin"
  description: { type: String }, // mô tả quyền của role
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
