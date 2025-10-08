const express = require("express");
const router = express.Router();
const c = require("../controller/booking.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// POST /api/bookings
router.post("/", authMiddleware, c.createBooking);

// GET /api/bookings/mentee
router.get("/mentee", authMiddleware, c.getMenteeBookedSlots);

// GET /api/bookings/status
router.get("/mentee/status", authMiddleware, c.getBookingStatusByMenteeId);

// GET /api/bookings/progress
router.get("/mentee/progress", authMiddleware, c.getLearningProgress);
// Mentor routes 
router.get("/mentor/applications", authMiddleware, c.getMentorApplications);
router.get("/mentor/applications/:applicationId", authMiddleware, c.getApplicationDetail);
// GET /api/bookings/:mentorId
router.get("/:mentorId", authMiddleware, c.getBookedSlots);



module.exports = router;
