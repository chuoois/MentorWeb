// models/comment.model.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true }, // Mentor được comment
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // Booking liên quan, để xác minh completed
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true }, // Người viết

  content: { type: String, required: true }, // Nội dung bình luận
  rating: { type: Number, min: 1, max: 5 }, // Đánh giá sao
  reply_to: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // Optional: reply cho comment khác
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);