// controllers/comment.controller.js
const Comment = require("../models/comment.model");
const Booking = require("../models/booking.model");
const Mentor = require("../models/mentor.model");
const Mentee = require("../models/mentee.model");

// ---------------------- GET COMMENTS BY MENTOR ----------------------
exports.getCommentsByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Phân trang

    // Kiểm tra mentor có tồn tại
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Lấy comment kèm thông tin mentee
    const comments = await Comment.find({ mentor: mentorId })
      .populate({ path: "mentee", select: "full_name email avatar_url" })
      .populate({ path: "booking", select: "start_time end_time sessions" })
      .sort({ createdAt: -1 }) // comment mới nhất trước
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Tính tổng comment (cho phân trang)
    const total = await Comment.countDocuments({ mentor: mentorId });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      comments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
