const menteeRoutes = require("./mentee.routes");
const mentorRoutes = require("./mentor.routes");
const bookingRoutes = require("./booking.routes");
const commentRoutes = require("./comment.routes");
const paymentsRoutes = require('./payment.routes');
const adminRoutes = require("./admin.routes");
const express = require("express");
const router = express.Router();

router.use("/mentees", menteeRoutes);
router.use("/mentors", mentorRoutes);
router.use("/bookings", bookingRoutes);
router.use("/comments", commentRoutes);
router.use('/payments', paymentsRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
