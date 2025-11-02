const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  created_at: { type: Date, default: Date.now }
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

  availability: {
    startTime: Number,
    endTime: Number,
  },

  bank_account: {
    bank_name: { type: String, required: false },
    account_number: { type: String, required: false },
    account_holder: { type: String, required: false }
  }

}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);