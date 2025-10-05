// backend/models/user.model.js
const mongoose = require('mongoose');
const Mentor = require('./mentor.model');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, unique: true, sparse: true },
    password_hash: { type: String }, // với Google login có thể để undefined
    full_name: { type: String, required: true },
    avatar_url: { type: String },
    role: { type: String, enum: ['ADMIN', 'MENTOR', 'MENTEE'], default: 'MENTEE' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'], default: 'ACTIVE' },
    email_verified: { type: Boolean, default: false },

    // OAuth
    provider: { type: String, enum: ['local', 'google'], default: 'local', index: true },
    google_id: { type: String, index: true, sparse: true },

    // ✅ Thêm hai trường phục vụ xác thực email
    verification_token: { type: String }, // token xác minh
    verification_expires: { type: Date }, // hạn dùng token
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

/**
 * Helper: đảm bảo có bản ghi Mentor khi role = 'MENTOR'
 */
async function ensureMentorExists(userDoc) {
  if (!userDoc?._id) return;
  const userId = userDoc._id;
  const role = userDoc.role;

  if (role === 'MENTOR') {
    const existed = await Mentor.findOne({ user_id: userId }).lean();
    if (!existed) {
      await Mentor.create({
        user_id: userId,
        job_title: '',
        company: '',
        category: '',
        skill: '',
        bio: '',
        current_position: '',
        linkedin_url: '',
        personal_link_url: '',
        intro_video: '',
        featured_article: '',
        question: {},
        cv_img: '',
      });
    }
  } else {
    // Nếu muốn khi role KHÔNG còn là MENTOR thì xoá hồ sơ mentor:
    // await Mentor.deleteOne({ user_id: userId });
    // Hoặc giữ lại (tuỳ business). Mặc định ở đây: GIỮ LẠI, không xoá.
  }
}

// Hook khi tạo mới user
userSchema.post('save', async function (doc, next) {
  try {
    await ensureMentorExists(doc);
    next();
  } catch (e) {
    next(e);
  }
});

// Hook khi update bằng findOneAndUpdate: bắt thay đổi role
userSchema.post('findOneAndUpdate', async function (result, next) {
  try {
    if (result) await ensureMentorExists(result);
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('User', userSchema);
