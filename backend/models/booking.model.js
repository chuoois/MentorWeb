const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
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
          enum: ["UPCOMING", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
          default: "UPCOMING",
        },
        mentor_confirmed: { type: Boolean, default: false },
        mentee_confirmed: { type: Boolean, default: false },
        note: { type: String },
        completed_at: { type: Date },
      },
    ],
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    paymentforMentor: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    note: { type: String },
    cancel_reason: { type: String },
    paymentProvider: { type: String, enum: ["PAYOS"], default: "PAYOS" },
    order_code: { type: Number, index: true, unique: true, sparse: true },
    payment_link_id: { type: String },
    payment_link_url: { type: String },
    currency: { type: String, default: "VND" },
    payos_status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED", "EXPIRED", "FAILED"],
      default: "PENDING",
    },
    payment_meta: { type: mongoose.Schema.Types.Mixed },
    payment_at: { type: Date },
  },
  { timestamps: true }
);

// Hook để tự động cập nhật session_times.status
bookingSchema.pre("save", function (next) {
  this.session_times.forEach((session) => {
    // Nếu buổi đã được xác nhận xong và hết giờ → hoàn tất
    if (
      session.status === "CONFIRMED" &&
      new Date(session.end_time) <= new Date()
    ) {
      session.status = "COMPLETED";
      session.completed_at = new Date();
    }
  });

  // Nếu tất cả buổi đều completed → booking hoàn tất
  if (
    this.session_times.every((s) => s.status === "COMPLETED") &&
    this.status !== "CANCELLED"
  ) {
    this.status = "COMPLETED";
  }

  next();
});


// Phương thức markPaid
bookingSchema.methods.markPaid = function (payosData) {
  this.status = "CONFIRMED";
  this.paymentStatus = "PAID";
  this.payos_status = "PAID";
  this.payment_meta = payosData || this.payment_meta;
  this.payment_at = new Date();
  return this;
};

// Phương thức markCancelled
bookingSchema.methods.markCancelled = function (payosData) {
    this.status = "CANCELLED";
  this.paymentStatus = "CANCELLED";
  this.payos_status = "CANCELLED";
  this.payment_meta = payosData || this.payment_meta;
  return this;
};

module.exports = mongoose.model("Booking", bookingSchema);