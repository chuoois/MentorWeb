// models/mentor.model.js
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: String,
    password_hash: String,

    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },

    status: { type: String, enum: ['PENDING', 'ACTIVE', 'REJECTED', 'BANNED'], default: 'PENDING', index: true },
    avatar_url: String,
    job_title: String, //Vị trí công việc: Software Engineer
    company: String, 
    category: String, //Chuyên ngành
    skill: String,
    bio: String,
    current_position: String, // Ví trí cự thể như: Backend Team Lead at KIS-V
    linkedin_url: String,
    personal_link_url: String,
    intro_video: String,
    featured_article: String,
    location: String,
    price: Number,

    submitted_at: Date,
    reviewed_at: Date,

    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    review_note: String,
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
