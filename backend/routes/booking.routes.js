const express = require("express");
const router = express.Router();
const c = require("../controller/booking.controller");
const cx = require("../controller/mentorApplications.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// ======================= MENTEE ROUTES =======================

// 1. Tạo booking (tự tạo link PayOS)
router.post("/", authMiddleware, checkRole("MENTEE"), c.createBooking);

// 2. Tạo lại link thanh toán PayOS
router.post("/:id/recreate-payment", authMiddleware, checkRole("MENTEE"), c.recreatePaymentLink);

// 3. Hủy booking (và hủy link PayOS nếu chưa thanh toán)
router.patch("/:id/cancel", authMiddleware, checkRole("MENTEE"), c.cancelBooking);

// 4. Lấy danh sách booking của mentee
router.get("/mentee", authMiddleware, checkRole("MENTEE"), c.getMenteeBookedSlots);

// 5. Lấy trạng thái booking theo menteeId
router.get("/mentee/status", authMiddleware, checkRole("MENTEE"), c.getBookingStatusByMenteeId);

// 6. Lấy tiến độ học tập (learning progress)
router.get("/mentee/progress", authMiddleware, checkRole("MENTEE"), c.getLearningProgress);

// ======================= MENTOR ROUTES =======================

// 1. Lấy danh sách đơn ứng tuyển
router.get("/applications", authMiddleware, checkRole("MENTOR"), cx.getMentorApplications);

// 2. Cập nhật trạng thái đơn ứng tuyển (CONFIRMED / CANCELLED)
router.patch("/applications/action/status", authMiddleware, checkRole("MENTOR"), cx.updateApplicationStatus);

// 3. Cập nhật thông tin buổi học
router.patch("/applications/:applicationId/session", authMiddleware, checkRole("MENTOR"), cx.updateSessionByMentor);

// 4. Lấy chi tiết đơn ứng tuyển theo ID
router.get("/applications/:applicationId", authMiddleware, checkRole("MENTOR"), cx.getApplicationDetail);

// 5. Lấy các slot đã được mentee book với mentor (mentor xem lịch)
router.get("/mentor/applications", authMiddleware, checkRole("MENTOR"), cx.getMentorBookedSlots);

// 6. Lấy tiến độ giảng dạy (mentor)
router.get("/mentor/learning/progress", authMiddleware, checkRole("MENTOR"), c.getTeachProgress);

// ======================= PUBLIC ROUTES =======================
// 1. Xác nhận buổi học
router.patch("/:bookingId/sessions/:sessionIndex/confirm", c.confirmSession);

// 2. Hủy buổi học
router.patch("/:bookingId/sessions/:sessionIndex/cancel", c.cancelSession);

// 1. Xem lịch đã book của một mentor (hiển thị trên profile)
router.get("/mentor/:mentorId/booked-slots", c.getBookedSlots);

module.exports = router;
