const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const timeSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  is_booked: { type: Boolean, default: false },
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

  // Tổng rating trung bình
  average_rating: { type: Number, default: 0 },

  // Danh sách từng đánh giá
  ratings: [ratingSchema],

  submitted_at: Date,
  reviewed_at: Date,
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  review_note: String,

  availability: [timeSlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);