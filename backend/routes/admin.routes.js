const express = require("express");
const router = express.Router();
const c = require("../controller/admin.controller");
const cx = require("../controller/booking.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");


// ======================= ADMIN ROUTES =======================
// Xem thống kê booking hoàn thành + xác nhận
router.get("/mentor/:mentorId/stats", authMiddleware, checkRole("ADMIN"), cx.getMentorWeeklyRevenue);

// Đánh dấu đã trả tiền cho mentor
router.put("/mentor/:mentorId/mark-paid", authMiddleware, checkRole("ADMIN"), cx.markMentorWeeklyPaid);

// LOGIN
router.post("/login", c.login);

// MENTOR MANAGEMENT
router.get("/mentors", authMiddleware, c.getMentors);
router.get("/mentors/:id", authMiddleware, checkRole("ADMIN"), c.getMentorDetail);
router.put("/mentors/:id/status", authMiddleware, checkRole("ADMIN"), c.changeMentorStatus);

// MENTEE MANAGEMENT
router.get("/mentees", authMiddleware, c.getMentees);
router.get("/mentees/:id", authMiddleware, checkRole("ADMIN"), c.getMenteeDetail);

module.exports = router;
