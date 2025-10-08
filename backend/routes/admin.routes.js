const express = require("express");
const router = express.Router();
const c = require("../controller/admin.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// LOGIN
router.post("/login", c.login);

// MENTOR MANAGEMENT
router.get("/mentors", authMiddleware, checkRole("ADMIN"), c.getMentors);
router.get("/mentors/:id", authMiddleware, checkRole("ADMIN"), c.getMentorDetail);
router.put("/mentors/:id/status", authMiddleware, checkRole("ADMIN"), c.changeMentorStatus);

// MENTEE MANAGEMENT
router.get("/mentees", authMiddleware, checkRole("ADMIN"), c.getMentees);
router.get("/mentees/:id", authMiddleware, checkRole("ADMIN"), c.getMenteeDetail);

module.exports = router;
