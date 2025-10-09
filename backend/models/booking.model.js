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
        default: "UPCOMING",
      },
      mentor_confirmed: { type: Boolean, default: false },
      note: { type: String },
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
    enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
    default: "PENDING",
    index: true,
  },

  note: { type: String },
  cancel_reason: { type: String },

  paymentProvider: { type: String, enum: ['PAYOS'], default: 'PAYOS' },

  // === PayOS-specific fields ===
  order_code: { type: Number, index: true, unique: true, sparse: true }, // orderCode của PayOS
  payment_link_id: { type: String },   // ID link thanh toán (nếu PayOS có trả về)
  payment_link_url: { type: String },  // checkoutUrl để redirect user
  currency: { type: String, default: 'VND' },

  // MỚI THÊM (bạn chưa có):
  payos_status: {
    type: String,
    enum: ["PENDING", "PAID", "CANCELLED", "EXPIRED", "FAILED"],
    default: "PENDING",
  },
  payment_meta: { type: mongoose.Schema.Types.Mixed }, // Lưu raw webhook data của PayOS
  payment_at: { type: Date },                          // Ngày thanh toán thành công
}, { timestamps: true });

// Giúp log thống nhất và dễ cập nhật webhook
bookingSchema.methods.markPaid = function (payosData) {
  this.paymentStatus = "PAID";
  this.payos_status = "PAID";
  this.payment_meta = payosData || this.payment_meta;
  this.payment_at = new Date();
  if (this.status === "PENDING") this.status = "CONFIRMED";
  return this;
};

bookingSchema.methods.markCancelled = function (payosData) {
  this.paymentStatus = "CANCELLED";
  this.payos_status = "CANCELLED";
  this.payment_meta = payosData || this.payment_meta;
  return this;
};

module.exports = mongoose.model("Booking", bookingSchema);
