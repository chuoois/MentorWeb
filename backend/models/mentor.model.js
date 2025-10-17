// models/mentor.model.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Ngày cụ thể
  start_time: { type: String, required: true }, // Ví dụ: "09:00"
  end_time: { type: String, required: true },   // Ví dụ: "11:00"
  is_booked: { type: Boolean, default: false }, // Dùng để check slot đã có học viên đặt chưa
}, { _id: false });

const mentorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  phone: String,
  password_hash: String,

  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },

  status: { type: String, enum: ['PENDING', 'ACTIVE', 'REJECTED', 'BANNED'], default: 'PENDING', index: true },
  avatar_url: String,
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
  location: String,
  price: Number,
  rating: Number,

  submitted_at: Date,
  reviewed_at: Date,
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  review_note: String,

  // 🔥 Thêm phần này
  availability: [timeSlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
