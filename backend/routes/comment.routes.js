const express = require("express");
const router = express.Router();
const c = require("../controller/comment.controller"); // giữ c
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// GET /api/comments/mentor/:mentorId
router.get("/mentor/:mentorId", c.getCommentsByMentor);


module.exports = router;