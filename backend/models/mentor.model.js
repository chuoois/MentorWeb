// backend/models/mentor.model.js
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    user_id:          { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true, index: true },
    job_title:        { type: String },
    company:          { type: String },        // optional
    category:         { type: String },
    skill:            { type: String },        // có thể là chuỗi mô tả / CSV
    bio:              { type: String },
    current_position: { type: String },
    linkedin_url:     { type: String },
    personal_link_url:{ type: String },
    intro_video:      { type: String },        // optional
    featured_article: { type: String },        // optional
    question:         { type: mongoose.Schema.Types.Mixed }, // JSON tuỳ ý
    cv_img:           { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Mentor", mentorSchema);
