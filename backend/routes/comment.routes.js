const express = require("express");
const router = express.Router();
const c = require("../controller/comment.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

// POST /api/ratings/:mentorId
router.post("/:mentorId", authMiddleware, c.addRating);

module.exports = router;