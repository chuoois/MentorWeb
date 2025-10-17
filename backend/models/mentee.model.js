// models/mentee.model.js
const mongoose = require("mongoose");

const menteeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: String,
    password_hash: String,
    status: {
      type: String,
      enum: ["BANNED", "ACTIVE"],
      default: "ACTIVE",
      index: true,
    },
    job_title: String,
    gpa: {
      type: Number,
      min: 0,
      max: 4,
      default: null,
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    motivation: {
      type: String,
      trim: true,
      default: "",
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    avatar_url: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentee", menteeSchema);