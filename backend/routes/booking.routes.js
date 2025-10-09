const express = require("express");
const router = express.Router();
const c = require("../controller/booking.controller");
const cx  = require("../controller/mentorApplications.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// ----------------- MENTEE ROUTES -----------------
router.post("/", authMiddleware, checkRole("MENTEE"), c.createBooking);
router.post("/:id/recreate-payment", authMiddleware, checkRole("MENTEE"), c.recreatePaymentLink);
router.patch("/:id/cancel", authMiddleware, checkRole("MENTEE"), c.cancelBooking);
router.get("/mentee", authMiddleware, c.getMenteeBookedSlots);
router.get("/mentee/status", authMiddleware, c.getBookingStatusByMenteeId);
router.get("/mentee/progress", authMiddleware, c.getLearningProgress);

// ----------------- MENTOR APPLICATION ROUTES -----------------
router.get("/applications", authMiddleware, cx.getMentorApplications);
router.get("/applications/:applicationId", authMiddleware, cx.getApplicationDetail);
router.patch("/applications/:bookingId/status", authMiddleware, cx.updateApplicationStatus);
router.patch("/applications/:bookingId/session/:sessionIndex", authMiddleware, cx.updateSessionByMentor);

// ----------------- OTHER ROUTES -----------------
router.get("/:mentorId", c.getBookedSlots);

module.exports = router;
