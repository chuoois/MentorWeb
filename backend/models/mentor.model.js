// backend/models/mentor.model.js
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'REJECTED'], default: 'PENDING', index: true },

  job_title: String,
  company: String,
  category: String,
  skill: String,
  bio: String,
  current_position: String,
  linkedin_url: String,
  personal_link_url: String,
  intro_video: String,
  featured_article: String,
  question: mongoose.Schema.Types.Mixed,
  cv_img: String,

  submitted_at: { type: Date },
  reviewed_at: { type: Date },
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  review_note: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Mentor', mentorSchema);
