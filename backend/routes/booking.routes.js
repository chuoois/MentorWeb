// backend/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const c = require("../controller/booking.controller");
const cx = require("../controller/mentorApplications.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// ================= MENTEE ROUTES =================
// 1. Tạo booking (tự tạo link PayOS)
router.post("/", authMiddleware, checkRole("MENTEE"), c.createBooking);

// 2. Tạo lại link thanh toán PayOS
router.post("/:id/recreate-payment", authMiddleware, checkRole("MENTEE"), c.recreatePaymentLink);

// 3. Hủy booking (và hủy link PayOS nếu chưa thanh toán)
router.patch("/:id/cancel", authMiddleware, checkRole("MENTEE"), c.cancelBooking);

// 4. Xem các booking của mentee
router.get("/mentee", authMiddleware, checkRole("MENTEE"), c.getMenteeBookedSlots);
router.get("/mentee/status", authMiddleware, checkRole("MENTEE"), c.getBookingStatusByMenteeId);
router.get("/mentee/progress", authMiddleware, checkRole("MENTEE"), c.getLearningProgress);

// ================= MENTOR ROUTES =================
router.get("/mentor/applications", authMiddleware, checkRole("MENTOR"), cx.getMentorApplications);
router.get("/mentor/applications/:applicationId", authMiddleware, checkRole("MENTOR"), cx.getApplicationDetail);

// ================= PUBLIC =================
// (Phải để cuối cùng để tránh nuốt các route trên)
router.get("/:mentorId", c.getBookedSlots);

module.exports = router;