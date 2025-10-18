const menteeRoutes = require("./mentee.routes");
const mentorRoutes = require("./mentor.routes");
const bookingRoutes = require('./booking.routes');
const commentRoutes = require("./comment.routes");
const paymentsRoutes = require('./payment.routes');
const adminRoutes = require("./admin.routes");
const aiRoutes = require("./ai.routes");
const express = require("express");
const router = express.Router();

router.use("/mentees", menteeRoutes);
router.use("/mentors", mentorRoutes);
router.use('/bookings', bookingRoutes);
router.use("/ratings", commentRoutes);
router.use('/payments', paymentsRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
