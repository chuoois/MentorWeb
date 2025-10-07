const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  duration: { type: Number, required: true }, // Số giờ mỗi buổi
  sessions: { type: Number, default: 1 }, // Tổng số buổi
  session_times: [
    {
      start_time: { type: Date, required: true },
      end_time: { type: Date, required: true },
      meeting_link: { type: String }, // link Google Meet
      status: {
        type: String,
        enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
        default: "UPCOMING", // Mặc định là sắp tới
      },
      mentor_confirmed: { type: Boolean, default: false }, //  Mentor tick xác nhận hoàn thành buổi học
      note: { type: String }, // Mentor có thể ghi nhận xét hoặc note thêm
    },
  ],
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    default: "PENDING",
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
  note: { type: String },
  cancel_reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);