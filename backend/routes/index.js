const menteeRoutes = require("./mentee.routes");
const mentorRoutes = require("./mentor.routes");
const bookingRoutes = require("./booking.routes");
const commentRoutes = require("./comment.routes");
const express = require("express");
const router = express.Router();

router.use("/mentees", menteeRoutes);
router.use("/mentors", mentorRoutes);
router.use("/bookings", bookingRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
